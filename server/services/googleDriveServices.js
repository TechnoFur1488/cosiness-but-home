import { google } from "googleapis"
import fs from "fs"
import { fileURLToPath } from "url"
import path, { dirname } from "path"
import sharp from "sharp"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "..", "google-credentials.json"),
    scopes: ["https://www.googleapis.com/auth/drive"]
})

const drive = google.drive({ version: "v3", auth, timeout: 10000 })

export const deleteLocalFiles = async () => {
    const pathFolder = path.join(__dirname, "..", "uploads")

    try {
        await fs.promises.access(pathFolder)
        const files = await fs.promises.readdir(pathFolder)

        await Promise.all(files.map(async (file) => {
            const filePath = path.join(pathFolder, file)
            const stat = await fs.promises.stat(filePath)

            if (stat.isDirectory()) {
                await fs.promises.rm(filePath, { recursive: true, force: true })
            } else {
                try {
                    await fs.promises.unlink(filePath)
                } catch (err) {
                    if (err.code !== "EBUSY") {
                        throw err
                    }

                    await new Promise(resolve => setTimeout(resolve, 100))
                    await fs.promises.unlink(filePath)
                }
            }
        }))

        console.log(`Содержимое папки ${pathFolder} успешно удалено`)

    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('Ошибка при удалении файлов:', err);
        }
    }
}

export const deleteDriveFiles = async (imgUrls) => {
    if (!imgUrls || !imgUrls.length) return

    await Promise.all(
        imgUrls.map(async (url) => {
            try {
                const fileId = url.match(/id=([^&]+)/)?.[1]

                if (fileId) {
                    await drive.files.delete({ fileId })
                    console.log(`Файл ${fileId} успешно удален из Drive`)
                }
            } catch (err) {
                console.error('Ошибка удаления файла из Drive:', err)
            }
        })
    )
}

export const postDriveFiles = async (files, folderId) => {
    if (!files || !files.length) return []


    let uploadedUrls = []
    const streamsToClose = []

    try {

        uploadedUrls = await Promise.all(files.map(async (file) => {

            const readStream = fs.createReadStream(file.path)
            const convertedStream = readStream.pipe(
                sharp()
                    .toFormat("webp", { quality: 80 })
                    .on('error', err => console.error('Conversion error:', err))
            )

            const originalName = file.originalname || path.basename(file.path)
            const webpName = path.parse(originalName).name + '.webp'

            streamsToClose.push(readStream)

            const fileMetadata = {
                name: webpName,
                parents: [folderId]
            }

            const media = {
                mimeType: "image/webp",
                body: convertedStream
            }

            const response = await drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: "id"
            })

            return `https://drive.google.com/uc?export=view&id=${response.data.id}`
        }))

        streamsToClose.forEach(stream => {
            if (typeof stream.close === 'function') {
                stream.close()
            }
        });

        return uploadedUrls

    } catch (err) {
        console.error('Ошибка загрузки файлов:', err);
        await deleteLocalFiles()
    }
}
