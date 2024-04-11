import React from "react";
import weatherImage from "./assets/weather.png";
import Moment from "react-moment";

function App() {
	return (
		<div className="w-full relative flex flex-wrap items-center justify-center">
			<Moment format="hh:mm A" className="m-10 font-semibold text-6xl">
				{new Date()}
			</Moment>
			<br />
			<img src={weatherImage} />
		</div>
	);
}

export default App;
