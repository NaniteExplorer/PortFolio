import React, { useRef } from "react";
import "./Projects.css";

const Projects = () => {
  const workListRef = useRef(null);

  // Scroll function to navigate left and right
  const scrollLeft = () => {
    workListRef.current.scrollBy({
      left: -300, // Adjust this value for how far you want to scroll
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    workListRef.current.scrollBy({
      left: 300, // Adjust this value for how far you want to scroll
      behavior: "smooth",
    });
  };

  const data = [
    {
      id: "1",
      name: "AmazeKart",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum at minima recusandae optio dolores nostrum hic, quod natus cupiditate neque atque sequi rerum nesciunt est et aliquam dolorem! Laboriosam, nulla?",
      image: "https://i.postimg.cc/85Dk5vhF/Image-Editor-1.png",
    },
    {
      id: "2",
      name: "AmazeKart",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum at minima recusandae optio dolores nostrum hic, quod natus cupiditate neque atque sequi rerum nesciunt est et aliquam dolorem! Laboriosam, nulla?",
      image: "https://i.postimg.cc/nrtyFHqS/i-Phone-15.png",
    },
    {
      id: "3",
      name: "AmazeKart",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum at minima recusandae optio dolores nostrum hic, quod natus cupiditate neque atque sequi rerum nesciunt est et aliquam dolorem! Laboriosam, nulla?",
      image: "https://i.postimg.cc/nrtyFHqS/i-Phone-15.png",
    },
    {
      id: "4",
      name: "AmazeKart",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum at minima recusandae optio dolores nostrum hic, quod natus cupiditate neque atque sequi rerum nesciunt est et aliquam dolorem! Laboriosam, nulla?",
      image: "https://i.postimg.cc/nrtyFHqS/i-Phone-15.png",
    },
    {
      id: "5",
      name: "AmazeKart",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum at minima recusandae optio dolores nostrum hic, quod natus cupiditate neque atque sequi rerum nesciunt est et aliquam dolorem! Laboriosam, nulla?",
      image: "https://i.postimg.cc/nrtyFHqS/i-Phone-15.png",
    },
    {
      id: "6",
      name: "AmazeKart",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum at minima recusandae optio dolores nostrum hic, quod natus cupiditate neque atque sequi rerum nesciunt est et aliquam dolorem! Laboriosam, nulla?",
      image: "https://i.postimg.cc/nrtyFHqS/i-Phone-15.png",
    },
  ];

  return (
    <>
      <div id="portofolio">
        <div className="container">
          <h1 className="sub-title">My Projects</h1>

          <div className="work-list" ref={workListRef}>
            <button className="carousel-btn left" onClick={scrollLeft}>
              &#10094;
            </button>
            {data.map(({ id, name, description, image }) => {
              return (
                <div className="work" id={id} key={id}>
                  <img src={image} alt={name} />
                  <div className="layer">
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <a href="#"></a>
                  </div>
                </div>
              );
            })}
            <button className="carousel-btn right" onClick={scrollRight}>
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
