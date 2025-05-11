import { google } from "googleapis"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const auth = new google.auth.GoogleAuth({
    keyFile: (__dirname, "..", "google-credentials.json"),
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