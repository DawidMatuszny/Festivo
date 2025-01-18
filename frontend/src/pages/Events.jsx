import { useNavigate } from 'react-router-dom';
import "../styles/events.css";
import { HiMusicalNote } from "react-icons/hi2";
import { GiPaintBrush, GiFilmProjector } from "react-icons/gi";
import { FaBookOpen } from "react-icons/fa";
import { RxColorWheel } from "react-icons/rx";
import { BsFillMortarboardFill } from "react-icons/bs";
import { MdFamilyRestroom } from "react-icons/md";
import { IoFootball } from "react-icons/io5";


const Events = () => {
	const navigate = useNavigate();

	const handleCategoryClick = (categoryID, categoryName) => {
		navigate(`/events/${categoryID}/${categoryName}`);
	};

	return (
		<div id='main'>
		<div className="category-container">
			<div className="category-card" onClick={() => handleCategoryClick('1', 'sztuka i kultura')} style={{ cursor: "pointer" }}>
			<div className="category-icon">
				<GiPaintBrush />
			</div>
			<div className="category-title">Sztuka i kultura</div>
			</div>

			<div className="category-card" onClick={() => handleCategoryClick('2')} style={{ cursor: "pointer" }}>
			<div className="category-icon">
				<HiMusicalNote />
			</div>
			<div className="category-title">Muzyka</div>
			</div>

			<div className="category-card" onClick={() => handleCategoryClick('3')} style={{ cursor: "pointer" }}>
			<div className="category-icon">
				<GiFilmProjector />
			</div>
			<div className="category-title">Film i multimedia</div>
			</div>

			<div className="category-card" onClick={() => handleCategoryClick('4')} style={{ cursor: "pointer" }}>
			<div className="category-icon">
				<FaBookOpen />
			</div>
			<div className="category-title">Literatura</div>
			</div>

			<div className="category-card" onClick={() => handleCategoryClick('5')} style={{ cursor: "pointer" }}>
			<div className="category-icon">
				<RxColorWheel />
			</div>
			<div className="category-title">Kultura i tradycje</div>
			</div>

			<div className="category-card" onClick={() => handleCategoryClick('6')} style={{ cursor: "pointer" }}>
			<div className="category-icon">
				<BsFillMortarboardFill />
			</div>
			<div className="category-title">Edukacja i nauka</div>
			</div>

			<div className="category-card" onClick={() => handleCategoryClick('7')} style={{ cursor: "pointer" }}>
			<div className="category-icon">
				<MdFamilyRestroom />
			</div>
			<div className="category-title">Dla dzieci i rodzin</div>
			</div>

			<div className="category-card" onClick={() => handleCategoryClick('8')} style={{ cursor: "pointer" }}>
			<div className="category-icon">
				<IoFootball />
			</div>
			<div className="category-title">Sport</div>
			</div>
		</div>
		</div>
	);
};

export default Events;