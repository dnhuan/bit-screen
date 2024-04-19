import React from "react";
import weatherImage from "./assets/weather.png";
import Moment from "react-moment";

function App() {
	return (
		<div className="w-full relative flex flex-wrap items-center justify-center overflow-hidden">
			<div className="block w-full text-center m-4">
				Danmi I love you ❤
			</div>
			<img src="/api/weather" />
		</div>
	);
}

export default App;
