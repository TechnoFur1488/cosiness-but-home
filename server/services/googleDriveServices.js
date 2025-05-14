import { google } from "googleapis"
import fs from "fs"
import { fileURLToPath } from "url"
import path, { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "..", "google-credentials.json"),
    scopes: ["https://www.googleapis.com/auth/drive"]
})

const drive = google.drive({ version: "v3", auth, timeout: 10000 })

export const deleteLocalFiles = async (files) => {
    if (!files || !files.length) return

    await Promise.all(
        files.map(file =>
            fs.promises.unlink(file.path).catch(err =>
                console.error(`Ошибка удаления локального файла ${file.path}:`, err)
            )
        )
    )
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

export const postDriveFiles = async (files) => {
    if (!files?.length) return []

    let uploadedUrls = []

    try {
        
        const uploadPromises = files.map(async (file) => {
            const fileMetadata = {
                name: file.originalname || path.basename(file.path),
                parents: [process.env.GOOGLE_DRIVE_PRODUCT_PHOTO]
            }

            const media = {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path)
            }

            const response = await drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: "id"
            })

            return `https://drive.google.com/uc?export=view&id=${response.data.id}`
        })

        return uploadedUrls = await Promise.all(uploadPromises)

    } catch (err) {

        if (uploadedUrls.length > 0) {
            await deleteDriveFiles(uploadedUrls)
            await deleteLocalFiles(files)
        }

        console.error('Ошибка загрузки файлов на Drive:', err)
    }
}
