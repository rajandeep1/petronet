interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function Logo({ size = 40, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/Petro-Canada_logo.jpg"
        alt="Petro-Canada"
        width={size}
        height={size}
        className="rounded-md object-cover"
      />
      {showText && (
        <span className="font-extrabold tracking-tight leading-none text-black" style={{ fontSize: size * 0.45 }}>
          Petro<span className="text-[#E30613]">-</span>Canada
        </span>
      )}
    </div>
  );
}
