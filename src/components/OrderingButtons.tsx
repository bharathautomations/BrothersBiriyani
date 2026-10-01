// Zomato/Swiggy are a separate "order food" path from the website's own Book a Table system.
// These are plain external links - no backend, no analytics platform exists on this site to hook into.

const ZOMATO_URL = 'https://www.zomato.com/bangalore/restaurants/brothers-biriyani?subzone=5209';
const SWIGGY_URL = 'https://www.swiggy.com/menu/423092?source=sharing';

interface OrderingButtonsProps {
  variant?: 'full' | 'compact';
  className?: string;
}

const OrderingButtons = ({ variant = 'full', className = '' }: OrderingButtonsProps) => {
  const sizeClasses =
    variant === 'compact'
      ? 'text-sm px-5 py-2.5'
      : 'text-sm xs:text-base md:text-lg px-6 xs:px-8 py-2.5 xs:py-3';

  const baseButtonClasses = `${sizeClasses} w-full xs:w-auto inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-charcoal-dark`;

  return (
    <div className={`flex flex-col xs:flex-row items-center gap-3 ${className}`}>
      <a
        href={ZOMATO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order food on Zomato (opens in a new tab)"
        className={`${baseButtonClasses} border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white focus:ring-brand-red`}
      >
        🍽️ Order on Zomato
      </a>
      <a
        href={SWIGGY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order food on Swiggy (opens in a new tab)"
        className={`${baseButtonClasses} border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white focus:ring-brand-orange`}
      >
        🛵 Order on Swiggy
      </a>
    </div>
  );
};

export default OrderingButtons;
