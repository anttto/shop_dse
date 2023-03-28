import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/ui/Button";

export default function ProductDetail() {
  const {
    state: {
      product: { url, options, type, title, category, description },
    },
  } = useLocation();
  const [selected, setSelected] = useState(options && options[0]);
  const handleSelect = (e) => setSelected(e.target.value);
  const handleClick = () => {
    //아아아아
  };
  return (
    <section className="p-5 flex flex-col">
      <div className="w-full px-4 ">
        <img className="inline-block" src={url} alt={title} />
      </div>
      <div className="w-full flex flex-col p-10 text-center">
        <h3>{title}</h3>
        <p>{description}</p>
        <p>{category}</p>
        <p>{type}</p>
        <select value={selected} onChange={handleSelect} className="w-32 mx-auto">
          {options && options.map((option, index) => <option key={index}>{option}</option>)}
        </select>
      </div>
      <div className="w-32 mx-auto">
        <Button text="좋아요 누르기" onClick={handleClick} />
      </div>
    </section>
  );
}
