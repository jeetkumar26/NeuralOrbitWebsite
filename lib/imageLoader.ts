export default function imageLoader({
    src,
    width,
    quality,
}: {
    src: string;
    width: number;
    quality?: number;
}) {
    // For GitHub Pages, images in /public are served under /NeuralOrbitWebsite/
    // so we need to prepend that prefix. In local dev the basePath is empty
    // (NEXT_PUBLIC_BASE_PATH is undefined) so this returns the original src.
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    return `${base}${src}`;
}
