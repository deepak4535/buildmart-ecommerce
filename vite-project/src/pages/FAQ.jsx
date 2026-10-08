import { useMemo, useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Mail,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

const faqData = [
  {
    id: 1,
    category: "Orders",
    question: "How can I place an order?",
    answer:
      "Browse the Products page, select the construction material you need, open the product details, choose the required quantity, and click Add to Cart. Then open your Cart, proceed to Checkout, select your payment method, and place the order.",
  },
  {
    id: 2,
    category: "Orders",
    question: "Can I change my order after placing it?",
    answer:
      "Order changes depend on the current order status. If the order has not been processed yet, contact our support team as soon as possible with your order ID.",
  },
  {
    id: 3,
    category: "Delivery",
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on the product, quantity, delivery location, and availability. The expected delivery information can vary for different construction materials and orders.",
  },
  {
    id: 4,
    category: "Delivery",
    question: "Do you deliver construction materials to my location?",
    answer:
      "We support construction-material delivery based on service availability. Please contact our support team with your location and required materials to confirm delivery availability.",
  },
  {
    id: 5,
    category: "Products",
    question: "What types of construction materials are available?",
    answer:
      "The marketplace can contain materials such as Cement, Bricks, Steel & Metal, Tools, Paint, Electrical Materials, Plumbing Materials, Tiles & Flooring, Wood & Boards, and Safety Equipment.",
  },
  {
    id: 6,
    category: "Products",
    question: "How can I search for a product?",
    answer:
      "Open the Products page and use the search box. You can search using a product name, description, or category. You can also filter products by category.",
  },
  {
    id: 7,
    category: "Cart",
    question: "Can I change the quantity of a product in my cart?",
    answer:
      "Yes. Open your Cart and use the plus and minus buttons to increase or decrease the quantity of each product.",
  },
  {
    id: 8,
    category: "Cart",
    question: "How do I remove a product from my cart?",
    answer:
      "Open the Cart page and click the Remove button next to the product you no longer want to purchase.",
  },
  {
    id: 9,
    category: "Wishlist",
    question: "What is the Wishlist used for?",
    answer:
      "The Wishlist allows you to save construction materials that you are interested in purchasing later. You can add products to your Wishlist using the heart icon.",
  },
  {
    id: 10,
    category: "Wishlist",
    question: "Can I move a Wishlist product to my Cart?",
    answer:
      "Yes. Open your Wishlist and use the Move to Cart option for the product you want to purchase.",
  },
  {
    id: 11,
    category: "Payment",
    question: "What payment methods are supported?",
    answer:
      "The available payment methods are displayed during Checkout. Select the payment method you prefer before confirming your order.",
  },
  {
    id: 12,
    category: "Payment",
    question: "Is my payment information stored?",
    answer:
      "The application uses the selected payment method to create an order record. Do not enter real sensitive banking or card credentials into this development project.",
  },
  {
    id: 13,
    category: "Account",
    question: "How can I create an account?",
    answer:
      "Click Register in the navigation bar, enter your required information, and submit the registration form. After successful registration, you can use your account to access protected features.",
  },
  {
    id: 14,
    category: "Account",
    question: "What should I do if I forget my password?",
    answer:
      "This development version does not currently include a password-reset system. Contact the project administrator for account assistance.",
  },
  {
    id: 15,
    category: "Orders",
    question: "Where can I see my previous orders?",
    answer:
      "After logging in, open the Orders page from the navigation bar. You can view your order history and open individual orders to see their details.",
  },
  {
    id: 16,
    category: "Account",
    question: "Can I update my profile information?",
    answer:
      "Yes. Open your Profile page and click Edit Profile. You can update your name, phone number, address, city, state, and pincode.",
  },
];

const categories = [
  "All",
  "Orders",
  "Delivery",
  "Products",
  "Cart",
  "Wishlist",
  "Payment",
  "Account",
];

function FAQ() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [openFaqId, setOpenFaqId] = useState(null);

  const filteredFaqs = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return faqData.filter((faq) => {
      const matchesCategory =
        selectedCategory === "All" ||
        faq.category === selectedCategory;

      const matchesSearch =
        search === "" ||
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search) ||
        faq.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [searchText, selectedCategory]);

  const handleFaqToggle = (faqId) => {
    setOpenFaqId((currentId) =>
      currentId === faqId ? null : faqId
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setOpenFaqId(null);
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategory("All");
    setOpenFaqId(null);
  };

  return (
    <section className="faq-page">
      <div className="faq-page-header">
        <div className="faq-header-icon">
          <HelpCircle size={34} />
        </div>

        <div>
          <p className="faq-page-label">
            HELP CENTER
          </p>

          <h1>Frequently Asked Questions</h1>

          <p>
            Find answers to common questions about
            construction materials, orders, payments,
            delivery, and your account.
          </p>
        </div>
      </div>

      <div className="faq-search-section">
        <div className="faq-search-box">
          <Search size={20} />

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search frequently asked questions..."
            aria-label="Search frequently asked questions"
          />
        </div>

        <div className="faq-category-list">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={
                selectedCategory === category
                  ? "faq-category-button active"
                  : "faq-category-button"
              }
              onClick={() =>
                handleCategoryChange(category)
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="faq-results-summary">
        <span>
          Showing{" "}
          <strong>{filteredFaqs.length}</strong>{" "}
          question
          {filteredFaqs.length !== 1 ? "s" : ""}
        </span>

        {(searchText ||
          selectedCategory !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="faq-empty-state">
          <HelpCircle size={42} />

          <h2>No FAQs Found</h2>

          <p>
            We couldn't find a question matching your
            search or selected category.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={clearFilters}
          >
            View All FAQs
          </button>
        </div>
      ) : (
        <div className="faq-list">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <article
                className={
                  isOpen
                    ? "faq-item open"
                    : "faq-item"
                }
                key={faq.id}
              >
                <button
                  type="button"
                  className="faq-question-button"
                  onClick={() =>
                    handleFaqToggle(faq.id)
                  }
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <div className="faq-question-content">
                    <span className="faq-question-number">
                      {String(faq.id).padStart(2, "0")}
                    </span>

                    <div>
                      <span className="faq-question-category">
                        {faq.category}
                      </span>

                      <h2>{faq.question}</h2>
                    </div>
                  </div>

                  <ChevronDown
                    size={21}
                    className={
                      isOpen
                        ? "faq-chevron rotated"
                        : "faq-chevron"
                    }
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="faq-answer"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <div className="faq-contact-card">
        <div className="faq-contact-icon">
          <Mail size={25} />
        </div>

        <div>
          <h2>Still Need Help?</h2>

          <p>
            If you couldn't find the answer you're
            looking for, contact our support team.
          </p>
        </div>

        <Link
          to="/contact"
          className="faq-contact-button"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}

export default FAQ;