
import './App.css'
import { useEffect, useState } from 'react';
import PlayerBox from "./components/PlayerBox"
import { socketClient } from './socketio-client/gameTyping';

interface allPlayerData {
	id: string,
	score: number,
	question: string,
	textInput: string,
	isIncorrect: boolean,
	disabledInput:boolean
}
function App() {
	const Players: Array<string> = ["#FF2121", "#1170FF", "#2EE400", "#FFB524"];
	const [allPlayer, setAllPlayer] = useState<allPlayerData[]>([]);
	const [time, setTime] = useState<number>(0);

	useEffect(() => {
		socketClient.on('initial-data', (initialData: allPlayerData[]) => {
		  setAllPlayer(initialData);
		});
	
		socketClient.on('updated-data', (updatedData: allPlayerData[]) => {
		  setAllPlayer(updatedData);
		});

		socketClient.on('time', (timeOnSocket:number) => {
			setTime(timeOnSocket);
		});
	
		return () => {
		  socketClient.off('initial-data');
		  socketClient.off('updated-data');
		  socketClient.off('time');
		};
	  }, []);
	  
	  useEffect(() => {		
		const timer = setInterval(() => {
		  if (time > 1) {
			socketClient.emit('time', time - 1);
		  } else {
			clearInterval(timer);
			socketClient.emit('time', 0);
			allPlayer.map((item) => {
				socketClient.emit('update-disabledInput', item.id, true);
			})
		  }		  
		}, 1000);
		return () => clearInterval(timer);
	  }, [time]);

	  const startGame = (maxTime:number) => {
		socketClient.emit('time', maxTime);
	  }

	  const stopGame = () => {
		socketClient.emit('time', 0);
		allPlayer.map((item) => {
			socketClient.emit('update-disabledInput', item.id, true);
		})
	  }

	  const resetAllData = () => {
		allPlayer.map((item) => {
			socketClient.emit('update-score', item.id, 0);
			socketClient.emit('update-textInput', item.id, "");
		})

	  };
	return (
		<div className="h-screen w-full p-4 flex flex-col">
			<div className='grid grid-cols-12 row-span-1 col-span-12 px-4 pb-4 items-center'>
				<button onClick={() => time > 0 ? stopGame() : startGame(60)} className='text-white text-lg font-bold py-2 px-4 col-span-2 h-fit rounded-md bg-[#762FD0]'>{time > 0 ? "STOP": "START"}</button>
				<svg onClick={resetAllData} className=' h-10 origin-center cursor-pointer transition active:scale-110' xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
					<path fill="#F98360" fillRule="evenodd" clipRule="evenodd" d="M0 30C0 15.858 0 8.787 4.392 4.392C8.79 0 15.858 0 30 0C44.142 0 51.213 0 55.605 4.392C60 8.79 60 15.858 60 30C60 44.142 60 51.213 55.605 55.605C51.216 60 44.142 60 30 60C15.858 60 8.787 60 4.392 55.605C0 51.216 0 44.142 0 30ZM41.805 10.776C42.2189 10.9446 42.5732 11.2327 42.8227 11.6035C43.0722 11.9743 43.2057 12.4111 43.206 12.858V21.003C43.206 21.5997 42.9689 22.172 42.547 22.594C42.125 23.0159 41.5527 23.253 40.956 23.253H33C32.5572 23.2532 32.1241 23.1228 31.7551 22.878C31.386 22.6332 31.0974 22.285 30.9254 21.8769C30.7534 21.4689 30.7056 21.0191 30.7881 20.584C30.8706 20.1489 31.0796 19.7478 31.389 19.431L33.675 17.091C31.4671 16.4126 29.1144 16.3588 26.8777 16.9354C24.6411 17.512 22.6077 18.6967 21.003 20.358C15.999 25.479 15.999 33.807 21.003 38.928C22.1695 40.136 23.5672 41.0967 25.113 41.7528C26.6587 42.409 28.3208 42.7471 30 42.7471C31.6792 42.7471 33.3413 42.409 34.887 41.7528C36.4328 41.0967 37.8305 40.136 38.997 38.928C40.9677 36.9077 42.238 34.3082 42.621 31.512C42.795 30.258 43.791 29.202 45.057 29.202C46.275 29.202 47.283 30.177 47.166 31.389C46.7848 35.4118 45.038 39.1828 42.216 42.075C40.6304 43.712 38.7319 45.0136 36.6334 45.9026C34.5348 46.7915 32.279 47.2495 30 47.2495C27.721 47.2495 25.4652 46.7915 23.3666 45.9026C21.2681 45.0136 19.3696 43.712 17.784 42.075C11.073 35.205 11.073 24.084 17.784 17.214C20.2316 14.6851 23.4038 12.9783 26.8628 12.3292C30.3218 11.6801 33.897 12.1206 37.095 13.59L39.345 11.286C39.6578 10.966 40.059 10.7465 40.4972 10.6557C40.9354 10.5648 41.3907 10.6067 41.805 10.776Z" />
				</svg>
				<div className='col-start-6 col-span-2 flex items-center justify-center py-2 px-4 rounded-md bg-[#CA3FE0]'>
					<span className='text-white font-bold text-lg'>TIME : {time}</span>
				</div>
				<span className='col-start-11 col-span-2 text-gray-400 text-end'>beta v0.0.5</span>
			</div>
			<div className='h-full grid grid-cols-12 grid-rows-6'>
				{allPlayer.map((item:allPlayerData, index) => (
				<PlayerBox key={index} item={item} playerColor={Players[index]} />
			))}
			</div>
		</div>
	)
}

export default App
