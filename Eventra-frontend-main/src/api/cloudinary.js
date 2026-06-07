import api from './axios.js'

export async function uploadFile(file){
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/files/upload', formData)
    const url = response.data?.url

    if (!url) {
        throw new Error('Upload completed, but the server did not return a file URL.')
    }

    return url
}
