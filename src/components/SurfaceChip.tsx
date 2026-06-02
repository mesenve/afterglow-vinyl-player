interface SurfaceChipProps {
  surface: string;
}

function SurfaceChip({ surface }: SurfaceChipProps) {
  return <span className="surface-chip">{surface}</span>;
}

export default SurfaceChip;
