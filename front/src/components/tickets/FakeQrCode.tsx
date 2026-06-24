const GRID_SIZE = 25;
const CELL = 10;
const PADDING = 16;

function hashString(str: string): number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function finderPattern(localX: number, localY: number): boolean {
    if (localX === 0 || localX === 6 || localY === 0 || localY === 6) {
        return true;
    }
    if (localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4) {
        return true;
    }
    return false;
}

function isInFinder(x: number, y: number, size: number): boolean {
    if (x < 8 && y < 8) return true;
    if (x >= size - 8 && y < 8) return true;
    if (x < 8 && y >= size - 8) return true;
    return false;
}

function getFinderValue(x: number, y: number, size: number): boolean {
    if (x < 8 && y < 8) return finderPattern(x, y);
    if (x >= size - 8 && y < 8) {
        return finderPattern(x - (size - 8), y);
    }
    if (x < 8 && y >= size - 8) {
        return finderPattern(x, y - (size - 8));
    }
    return false;
}

function isDarkModule(
    x: number,
    y: number,
    size: number,
    seed: number
): boolean {
    if (isInFinder(x, y, size)) {
        return getFinderValue(x, y, size);
    }
    const n = (seed ^ Math.imul(x, 374761393) ^ Math.imul(y, 668265263)) >>> 0;
    return n % 3 !== 0;
}

type FakeQrCodeProps = {
    value: string;
    className?: string;
};

export function FakeQrCode({ value, className }: FakeQrCodeProps) {
    const seed = hashString(value);
    const dim = GRID_SIZE * CELL + PADDING * 2;
    const modules = [];

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (!isDarkModule(x, y, GRID_SIZE, seed)) continue;
            modules.push(
                <rect
                    key={`${x}-${y}`}
                    x={PADDING + x * CELL}
                    y={PADDING + y * CELL}
                    width={CELL}
                    height={CELL}
                    fill="currentColor"
                />
            );
        }
    }

    return (
        <svg
            viewBox={`0 0 ${dim} ${dim}`}
            className={className}
            role="img"
            aria-label="Codigo QR del pase"
        >
            <rect width={dim} height={dim} fill="white" />
            {modules}
        </svg>
    );
}
