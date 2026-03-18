import React from "react";
import Pagination from "Pagination.jsx";

function PaginationPage() {

  const products = [
    "Hair Growth Serum",
    "De Tan Cream",
    "Vitamin C Serum",
    "Keratin Shampoo",
    "Hair Fall Control Oil",
    "Anti Aging Cream",
    "Face Wash",
    "Moisturizer",
    "Sunscreen SPF 50",
    "Night Repair Cream",
    "Aloe Vera Gel",
    "Skin Brightening Serum"
  ];

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">Pagination Example</h2>

      <Pagination items={products} itemsPerPage={4} />

    </div>
  );
}

export default PaginationPage;