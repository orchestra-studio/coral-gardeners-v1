/**
 * Wrapper utility to export DOM element to PNG using either `html-to-image` or a
 * fallback using `html2canvas` when `html-to-image` is not available on build/bundler.
 */
export async function exportToPng(
    element: HTMLElement,
    options: {
        pixelRatio?: number
        backgroundColor?: string
        quality?: number
        cacheBust?: boolean
        // `filter` matches html-to-image API; fallback is ignored
        filter?: (node: Node) => boolean
    } = {}
): Promise<string> {
    // Prefer `html-to-image` when possible for better fidelity. Try dynamic import.
    try {
        const htmlToImageModule = await import('html-to-image').catch(() => null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const htmlToImage: any = htmlToImageModule
        if (htmlToImage && typeof htmlToImage.toPng === 'function') {
            return await htmlToImage.toPng(element, options)
        }
    } catch {
        // fallback to html2canvas
    }

    // Fallback: use html2canvas
    const html2canvas = (await import('html2canvas')).default
    let elementToUse = element
    let container: HTMLElement | null = null
    if (typeof options.filter === 'function') {
        // clone to avoid modifying the real DOM
        elementToUse = element.cloneNode(true) as HTMLElement
        // Traverse and remove filtered nodes
        const traverseAndRemove = (node: Node | null) => {
            if (!node || !('childNodes' in node)) return
            const childNodes: Node[] = Array.from(node.childNodes)
            for (const child of childNodes) {
                if (!options.filter!(child)) {
                    node.removeChild(child)
                } else {
                    traverseAndRemove(child)
                }
            }
        }
        traverseAndRemove(elementToUse)

        // Append clone to a visually-hidden container so styles and images are computed
        container = document.createElement('div')
        container.style.position = 'fixed'
        container.style.left = '-9999px'
        container.style.top = '-9999px'
        container.style.opacity = '0'
        container.style.pointerEvents = 'none'
        container.style.zIndex = '-9999'
        container.appendChild(elementToUse)
        document.body.appendChild(container)
    }

    const canvas = await html2canvas(elementToUse, {
        backgroundColor: options.backgroundColor ?? null,
        scale: options.pixelRatio ?? 1,
    })

    try {
        return canvas.toDataURL('image/png', options.quality ?? 1)
    } finally {
        // Clean up the temporary DOM container if we created one
        if (container && container.parentNode) {
            container.parentNode.removeChild(container)
        }
    }
}
