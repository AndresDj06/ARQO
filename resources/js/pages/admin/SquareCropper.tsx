import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
    onCropped: (file: File) => void;
};

export default function SquareCropper({ onCropped }: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

    const onFile = useCallback((file: File) => {
        const url = URL.createObjectURL(file);
        setPreview(url);
        setOffset({ x: 0, y: 0 });
    }, []);

    function exportSquare() {
        const image = imageRef.current;
        if (!image) return;
        const size = 900;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight);
        const dw = image.naturalWidth * scale;
        const dh = image.naturalHeight * scale;
        ctx.drawImage(image, size / 2 - dw / 2 + offset.x, size / 2 - dh / 2 + offset.y, dw, dh);
        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                onCropped(new File([blob], 'miniatura.jpg', { type: 'image/jpeg' }));
            },
            'image/jpeg',
            0.86,
        );
    }

    return (
        <div className="space-y-3">
            <label className="block cursor-pointer rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 hover:border-slate-500">
                Cargar miniatura 1:1
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) onFile(file);
                    }}
                />
            </label>
            {preview && (
                <div
                    className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-slate-200"
                    onMouseDown={(event) => {
                        drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
                    }}
                    onMouseMove={(event) => {
                        if (!drag.current) return;
                        setOffset({
                            x: drag.current.ox + (event.clientX - drag.current.x),
                            y: drag.current.oy + (event.clientY - drag.current.y),
                        });
                    }}
                    onMouseUp={() => {
                        drag.current = null;
                    }}
                    onMouseLeave={() => {
                        drag.current = null;
                    }}
                >
                    <img
                        ref={imageRef}
                        src={preview}
                        alt="Recorte de miniatura"
                        className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
                        style={{ transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)` }}
                    />
                </div>
            )}
            {preview && (
                <Button type="button" variant="outline" onClick={exportSquare}>
                    Aplicar recorte cuadrado
                </Button>
            )}
        </div>
    );
}
