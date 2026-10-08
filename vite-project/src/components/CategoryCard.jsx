import { Link } from "react-router-dom";
import {
  ArrowRight,
  Blocks,
  BrickWall,
  Hammer,
  PaintBucket,
  Ruler,
  Wrench,
} from "lucide-react";

const categoryIcons = {
  Cement: Blocks,
  Bricks: BrickWall,
  "Steel & Metal": Wrench,
  Tools: Hammer,
  Paint: PaintBucket,
  "Electrical Materials": Wrench,
  "Plumbing Materials": Wrench,
  "Tiles & Flooring": Blocks,
  "Wood & Boards": Ruler,
  "Safety Equipment": Hammer,
};

function CategoryCard({ category }) {
  const categoryName =
    typeof category === "string"
      ? category
      : category?.name || category?.category || "Construction Materials";

  const categoryId =
    typeof category === "string"
      ? category
      : category?.id || categoryName;

  const Icon =
    categoryIcons[categoryName] || Blocks;

  return (
    <Link
      to={`/products?category=${encodeURIComponent(categoryName)}`}
      className="category-card"
    >
      <div className="category-card-icon">
        <Icon size={32} strokeWidth={1.8} />
      </div>

      <div className="category-card-content">
        <h3>{categoryName}</h3>

        <p>
          Explore quality {categoryName.toLowerCase()} for your construction
          projects.
        </p>

        <span className="category-card-link">
          View Products
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

export default CategoryCard;