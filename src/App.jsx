import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";
import "./App.css";

function App() {
	const [board, setBoard] = useState(Array(9).fill(null));
	const [isXTurn, setIsXTurn] = useState(true);
	const [showConfetti, setShowConfetti] = useState(false);
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],

		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],

		[0, 4, 8],
		[2, 4, 6],
	];

	// Update window size on resize
	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Check for winners and trigger confetti
	useEffect(() => {
		const winner = getWinner(board);
		if (winner) {
			setShowConfetti(true);
			const timer = setTimeout(() => setShowConfetti(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [board]);

	function getWinner(squares) {
		for (let i = 0; i < winningCombinations.length; i++) {
			const [a, b, c] = winningCombinations[i];
			if (
				squares[a] &&
				squares[a] === squares[b] &&
				squares[a] === squares[c]
			) {
				return squares[a];
			}
		}
		return null;
	}

	function handleSquareClick(index) {
		if (board[index] || getWinner(board)) {
			return;
		}

		const updateBoard = [...board];
		updateBoard[index] = isXTurn ? "X" : "O";

		setBoard(updateBoard);
		setIsXTurn(!isXTurn);
	}

	function getGameStatus() {
		const winner = getWinner(board);

		if (winner) {
			return `Winner: ${winner}`;
		}

		if (board.every((square) => square !== null)) {
			return "It's a draw!";
		}

		return `Next player: ${isXTurn ? "X" : "O"}`;
	}

	function resetGame() {
		setBoard(Array(9).fill(null));
		setIsXTurn(true);
		setShowConfetti(false);
	}

	return (
		<>
			{showConfetti && (
				<ReactConfetti
					width={windowSize.width}
					height={windowSize.height}
					recycle={false}
					numberOfPieces={600}
					gravity={0.5}
					initialVelocityX={15}
					initialVelocityY={30}
					confettiSource={{
						x: windowSize.width / 2,
						y: windowSize.height / 2,
						w: 0,
						h: 0,
					}}
					tweenDuration={100}
					colors={[
						"#f43f5e", // rose-500
						"#fb7185", // rose-400
						"#fda4af", // rose-300
						"#ffffff",
						"#fecdd3", // rose-200
						"#ffe4e6", // rose-100
						"#fff1f2", // rose-50
					]}
					className="confetti-container"
				/>
			)}
			<div className="min-h-screen w-full bg-gradient-to-br from-rose-950 via-rose-900 to-rose-800 flex items-center justify-center p-4">
				<div className="w-full max-w-[400px] backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-rose-200/20 shadow-xl">
					<h1 className="text-5xl font-bold text-white mb-8 text-center tracking-tight drop-shadow-md">
						TIC TAC TOE
					</h1>
					<div
						className={`text-center mb-8 p-3 rounded-xl ${
							getWinner(board)
								? "text-2xl font-bold text-rose-200 animate-pulse bg-white/5"
								: "text-xl text-white"
						}`}>
						{getGameStatus()}
					</div>
					<div className="grid grid-cols-3 gap-3 mb-8">
						{board.map((square, index) => (
							<button
								key={index}
								onClick={() => handleSquareClick(index)}
								className={`h-28 w-full backdrop-blur-sm rounded-xl text-6xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg
									${square ? "shadow-inner" : "shadow"}
									${
										square === "X"
											? "text-white bg-rose-500/30 border border-rose-400/30"
											: square === "O"
											? "text-white bg-rose-300/30 border border-rose-200/30"
											: "bg-white/5 border border-white/20 hover:bg-white/20"
									}`}>
								{square}
							</button>
						))}
					</div>
					<button
						className="w-full py-4 text-xl text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl hover:opacity-90 transition-all duration-300 hover:shadow-lg shadow-md font-semibold"
						onClick={resetGame}>
						New Game
					</button>
				</div>
			</div>
		</>
	);
}

export default App;
