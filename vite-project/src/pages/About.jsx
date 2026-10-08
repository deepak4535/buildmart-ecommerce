import { Link } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Users,
  Package,
} from "lucide-react";

function About() {
  return (
    <div className="about-page">

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="about-hero">

        <div className="about-hero-content">

          <span className="about-label">
            ABOUT US
          </span>

          <h1>
            Construction Material
            <span> Workplace</span>
          </h1>

          <p>
            Your trusted online marketplace for quality
            construction materials at affordable prices.
          </p>

          <Link
            to="/products"
            className="about-shop-button"
          >
            Explore Products
          </Link>

        </div>

      </section>


      {/* =========================
          INTRODUCTION
      ========================= */}

      <section className="about-introduction">

        <div className="about-introduction-icon">
          <Building2 size={50} />
        </div>

        <div className="about-introduction-content">

          <h2>
            About Construction Material Workplace
          </h2>

          <p>
            Construction Material Workplace is an
            e-commerce platform designed to make
            purchasing construction materials simple,
            convenient, and reliable.
          </p>

          <p>
            Customers can browse different categories,
            search for products, add products to their
            cart or wishlist, place orders, and manage
            their account from one platform.
          </p>

          <p>
            Our marketplace brings essential construction
            materials together so customers can easily
            find the products they need for residential
            and commercial projects.
          </p>

        </div>

      </section>


      {/* =========================
          WHAT WE OFFER
      ========================= */}

      <section className="about-features">

        <div className="about-section-heading">

          <span>
            WHY CHOOSE US
          </span>

          <h2>
            Everything You Need for Construction
          </h2>

          <p>
            We provide a simple shopping experience
            for construction materials.
          </p>

        </div>


        <div className="about-feature-grid">

          <div className="about-feature-card">

            <div className="about-feature-icon">
              <Package size={30} />
            </div>

            <h3>
              Wide Product Range
            </h3>

            <p>
              Browse construction materials across
              multiple categories in one place.
            </p>

          </div>


          <div className="about-feature-card">

            <div className="about-feature-icon">
              <BadgeCheck size={30} />
            </div>

            <h3>
              Quality Products
            </h3>

            <p>
              Find construction materials suitable for
              different residential and commercial needs.
            </p>

          </div>


          <div className="about-feature-card">

            <div className="about-feature-icon">
              <Truck size={30} />
            </div>

            <h3>
              Convenient Ordering
            </h3>

            <p>
              Add products to your cart and place your
              order through a simple checkout process.
            </p>

          </div>


          <div className="about-feature-card">

            <div className="about-feature-icon">
              <ShieldCheck size={30} />
            </div>

            <h3>
              Secure Shopping
            </h3>

            <p>
              Manage your account, wishlist, cart,
              orders, and profile securely.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          CATEGORIES
      ========================= */}

      <section className="about-categories">

        <div className="about-section-heading">

          <span>
            OUR PRODUCTS
          </span>

          <h2>
            Construction Materials in One Place
          </h2>

          <p>
            Explore the major product categories
            available on our platform.
          </p>

        </div>


        <div className="about-category-list">

          <div>
            Cement
          </div>

          <div>
            Steel & TMT Bars
          </div>

          <div>
            Bricks & Blocks
          </div>

          <div>
            Sand
          </div>

          <div>
            Aggregates
          </div>

          <div>
            Tiles
          </div>

          <div>
            Paints
          </div>

          <div>
            Plumbing Materials
          </div>

          <div>
            Electrical Materials
          </div>

          <div>
            Tools & Hardware
          </div>

        </div>

      </section>


      {/* =========================
          CUSTOMER EXPERIENCE
      ========================= */}

      <section className="about-customer-section">

        <div className="about-customer-content">

          <span>
            CUSTOMER EXPERIENCE
          </span>

          <h2>
            Simple. Convenient. Reliable.
          </h2>

          <p>
            From discovering construction materials to
            placing an order, our platform is designed
            to provide a straightforward shopping
            experience.
          </p>

          <div className="about-customer-points">

            <div>
              <Users size={22} />

              <span>
                Easy account management
              </span>
            </div>

            <div>
              <Package size={22} />

              <span>
                Easy product discovery
              </span>
            </div>

            <div>
              <Truck size={22} />

              <span>
                Simple order process
              </span>
            </div>

          </div>

          <Link
            to="/products"
            className="about-shop-button"
          >
            Start Shopping
          </Link>

        </div>

      </section>


      {/* =========================
          CTA
      ========================= */}

      <section className="about-cta">

        <h2>
          Ready to Find Your Construction Materials?
        </h2>

        <p>
          Explore our products and start shopping today.
        </p>

        <Link
          to="/products"
          className="about-cta-button"
        >
          View Products
        </Link>

      </section>

    </div>
  );
}

export default About;