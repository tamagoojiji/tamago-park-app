import Calendar from '../components/Calendar';
import CtaBanner from '../components/CtaBanner';
import HalloweenBanner from '../components/HalloweenBanner';
import ChristmasBanner from '../components/ChristmasBanner';
import { useHalloween } from '../hooks/useHalloween';
import { useChristmas } from '../hooks/useChristmas';

export default function HomePage() {
  const halloween = useHalloween();
  const christmas = useChristmas();

  return (
    <main>
      {halloween && <HalloweenBanner />}
      {christmas && <ChristmasBanner />}
      <Calendar />
      <CtaBanner />
    </main>
  );
}
