import Calendar from '../components/Calendar';
import CtaBanner from '../components/CtaBanner';
import HalloweenBanner from '../components/HalloweenBanner';
import { useHalloween } from '../hooks/useHalloween';

export default function HomePage() {
  const halloween = useHalloween();

  return (
    <main>
      {halloween && <HalloweenBanner />}
      <Calendar />
      <CtaBanner />
    </main>
  );
}
