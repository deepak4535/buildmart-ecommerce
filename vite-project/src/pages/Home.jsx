import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrickWall,
  Building2,
  CheckCircle,
  Hammer,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import CategoryCard from "../components/CategoryCard";

const categories = [
  "Cement",
  "Bricks",
  "Steel & Metal",
  "Tools",
  "Paint",
  "Electrical Materials",
  "Plumbing Materials",
  "Tiles & Flooring",
  "Wood & Boards",
  "Safety Equipment",
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Quality Materials",
    description:
      "Choose reliable construction materials suitable for residential and commercial projects.",
  },
  {
    icon: Truck,
    title: "Convenient Shopping",
    description:
      "Browse products, add them to your cart and place orders from one convenient platform.",
  },
  {
    icon: CheckCircle,
    title: "Easy Ordering",
    description:
      "Simple product browsing, cart management and checkout experience.",
  },
];

const featuredProducts = [
  {
    id: "home-cement",
    name: "Premium Construction Cement",
    category: "Cement",
    price: 420,
    description:
      "High-quality cement suitable for general construction applications.",
  },
  {
    id: "home-bricks",
    name: "Red Clay Bricks",
    category: "Bricks",
    price: 12,
    description:
      "Durable bricks suitable for walls and general construction work.",
  },
  {
    id: "home-steel",
    name: "TMT Steel Rods",
    category: "Steel & Metal",
    price: 68000,
    description:
      "Strong reinforcement steel suitable for structural construction.",
  },
  {
    id: "home-tools",
    name: "Professional Construction Tool Kit",
    category: "Tools",
    price: 2499,
    description:
      "Useful hand tools for construction and maintenance work.",
  },
];

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-hero-label">
            CONSTRUCTION MATERIAL WORKPLACE
          </p>

          <h1>
            Build Better.
            <br />
            Build Stronger.
          </h1>

          <p className="home-hero-description">
            Find quality construction materials, tools and supplies for
            residential, commercial and professional construction projects.
          </p>

          <div className="home-hero-actions">
            <Link to="/products" className="primary-button">
              Shop Construction Materials
              <ArrowRight size={18} />
            </Link>

            <Link to="/about" className="secondary-button">
              Learn More
            </Link>
          </div>

          <div className="home-hero-highlights">
            <span>
              <CheckCircle size={17} />
              Quality Products
            </span>

            <span>
              <CheckCircle size={17} />
              Wide Selection
            </span>

            <span>
              <CheckCircle size={17} />
              Easy Ordering
            </span>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="hero-building-card">
            <Building2 size={90} strokeWidth={1.2} />

            <div className="hero-visual-tools">
              <div>
                <BrickWall size={28} />
              </div>

              <div>
                <Hammer size={28} />
              </div>

              <div>
                <Wrench size={28} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="home-benefits">
        <div className="section-heading">
          <p>WHY CHOOSE US</p>
          <h2>Everything You Need to Build</h2>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div className="benefit-card" key={benefit.title}>
                <div className="benefit-icon">
                  <Icon size={28} />
                </div>

                <h3>{benefit.title}</h3>

                <p>{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="home-categories">
        <div className="section-heading section-heading-with-link">
          <div>
            <p>SHOP BY CATEGORY</p>
            <h2>Construction Materials</h2>
          </div>

          <Link to="/products" className="section-link">
            View All
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category}
              category={category}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-featured">
        <div className="section-heading section-heading-with-link">
          <div>
            <p>FEATURED PRODUCTS</p>
            <h2>Popular Construction Supplies</h2>
          </div>

          <Link to="/products" className="section-link">
            Browse Products
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="featured-products-grid">
          {featuredProducts.map((product) => (
            <div className="featured-product-card" key={product.id}>
              <div className="featured-product-icon">
                <Building2 size={34} />
              </div>

              <span className="featured-product-category">
                {product.category}
              </span>

              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <div className="featured-product-bottom">
                <strong>
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>

                <Link
                  to={`/products?category=${encodeURIComponent(
                    product.category
                  )}`}
                  className="featured-product-link"
                >
                  Explore
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-cta-content">
          <p>READY TO START YOUR PROJECT?</p>

          <h2>
            Get the materials you need
            <br />
            to build with confidence.
          </h2>

          <p>
            Explore our construction-material marketplace and find products
            for your next project.
          </p>

          <Link to="/products" className="primary-button">
            Explore Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;