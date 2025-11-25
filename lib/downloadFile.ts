/**
 * Downloads a file from a URL by fetching it and triggering a browser download
 * @param url - The URL of the file to download
 * @param filename - Optional filename for the downloaded file
 */
export async function downloadFile(url: string, filename?: string): Promise<void> {
    try {
        // Fetch the file
        const response = await fetch(url)
        if (!response.ok) throw new Error('Download failed')

        // Get the blob
        const blob = await response.blob()

        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob)

        // Create a temporary anchor element
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename || url.split('/').pop() || 'download'

        // Trigger the download
        document.body.appendChild(link)
        link.click()

        // Cleanup
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
        console.error('Download error:', error)
        // Fallback: try opening in new tab with download attribute
        const link = document.createElement('a')
        link.href = url
        link.download = filename || url.split('/').pop() || 'download'
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}
