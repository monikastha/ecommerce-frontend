import BuyerFooter from "../../../components/BuyerFooter";
import BuyerNavbar from "../../../components/BuyerNavbar2";
import { getBuyerCartCount } from "../../../utils/buyerCart";

import cartoon1 from "../../../assets/cartoon1.png";
import cartoon2 from "../../../assets/cartoon2.png";
import shoesImg from "../../../assets/shoes4.jpg";
import headphoneImg from "../../../assets/headphone.jpg";

const reviews = [
  {
    id: 1,
    name: "Kabita Kumal",
    product: "Wireless Headphones",
    text: "Excellent service. Delivery was fast, packaging was neat, and the product quality was better than expected.",
    rating: 5,
    img: cartoon1,
  },
  {
    id: 2,
    name: "Kabita Thapa",
    product: "Black Leather Shoes",
    text: "Great products at fair prices. I liked the simple checkout flow and the product matched the photos.",
    rating: 5,
    img: cartoon2,
  },
  {
    id: 3,
    name: "Aayush Shrestha",
    product: "Gaming Accessories",
    text: "The item arrived on time and the support team answered my question quickly. Very smooth experience.",
    rating: 4,
    img: headphoneImg,
  },
  {
    id: 4,
    name: "Srijana Rai",
    product: "Daily Wear Shoes",
    text: "Easy to browse, easy to compare, and the product was delivered safely. I would order again.",
    rating: 5,
    img: shoesImg,
  },
];

const Stars = ({ n }: { n: number }) => (
  <span className="text-amber-400 text-sm">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>
);

export default function ViewAllReviews() {
  return (
    <div className="min-h-screen bg-slate-50">
      <BuyerNavbar cartQty={getBuyerCartCount()} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-bold text-violet-600 uppercase">Buyer Reviews</p>
          <h1 className="text-3xl font-black text-slate-900 mt-2">What Our Customers Say</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Real feedback from Sajilo Mart buyers about products, delivery, and shopping experience.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-16 h-16 rounded-full object-cover shrink-0 ring-2 ring-violet-100"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black text-slate-900">{review.name}</h2>
                    <span className="text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded-full font-bold">
                      Verified Buyer
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{review.product}</p>
                  <div className="mt-2">
                    <Stars n={review.rating} />
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-6 mt-4">{review.text}</p>
            </article>
          ))}
        </section>
      </main>

      <BuyerFooter />
    </div>
  );
}
