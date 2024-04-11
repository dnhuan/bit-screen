import React from "react";
import Moment from "react-moment";
function App() {
	return (
		<div className="w-full relative flex items-center justify-center">
			<Moment format="hh:mm A" className="m-10 font-semibold text-6xl">
				{new Date()}
			</Moment>
		</div>
	);
}

export default App;
