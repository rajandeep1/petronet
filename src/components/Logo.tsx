interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'full' | 'icon';
  textColor?: string;
}

export function Logo({ size = 40, showText = true, textColor = '#000000' }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized maple leaf - Petro-Canada inspired */}
        <path
          d="M50 5 L57 28 L82 25 L67 43 L90 50 L67 57 L82 75 L57 72 L50 95 L43 72 L18 75 L33 57 L10 50 L33 43 L18 25 L43 28 Z"
          fill="#E30613"
          stroke="#E30613"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span
          className="font-extrabold tracking-tight leading-none"
          style={{ color: textColor, fontSize: size * 0.45 }}
        >
          Petro<span style={{ color: '#E30613' }}>-</span>Canada
        </span>
      )}
    </div>
  );
}
