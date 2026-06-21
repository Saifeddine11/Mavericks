/**
 * Stacked OFF + MARKET masks — static / reduced-motion composition.
 */

import OffMarketLineMask from '@/components/cinematic/sections/OffMarketLineMask';
import { cn } from '@/lib/utils';

export default function OffMarketStackedMask({
  src,
  lineOff = 'OFF',
  lineMarket = 'MARKET',
  className,
  videoProps = {},
}) {
  return (
    <div
      className={cn(
        'flex w-full max-w-[100vw] flex-col items-center justify-center leading-none',
        className,
      )}
    >
      <div className="h-[clamp(4.8rem,18vw,14rem)] w-full md:h-[clamp(8rem,18vw,22rem)]">
        <OffMarketLineMask src={src} text={lineOff} variant="off" {...videoProps} />
      </div>
      <div className="-mt-[0.06em] h-[clamp(5.4rem,20vw,16rem)] w-full md:h-[clamp(9rem,20vw,26rem)]">
        <OffMarketLineMask src={src} text={lineMarket} variant="market" {...videoProps} />
      </div>
    </div>
  );
}
