import './classic.css'
import { useStart } from '@/context/startContext';

export default function  Discripion(props:any) {

	const [start] = useStart();


	if (props.mode === 'tennis') {
		return(
			<div className="discription-game" style={start ? {display: 'none'} : {display: 'block'}} >
				<div className='discription-title' >Welcome to Tennis Mode!</div>
				<br /> This exciting variation of 2D Pong allows you and a friend to engage in a tennis-style match, controlling your paddles with the mouse.
				<br /> controlling your paddles with the mouse.<br />  
				<ul>
					<li>The Players controls the paddles by moving the mouse up and down. Slide the mouse upwards to move the paddle up and downwards to move it down. </li>
					<li>The winner is the first player to score 5 points. </li>
					<li>Get ready for an engaging and interactive experience that replicates the thrill of a real-life ping pong match. Enjoy the game! </li>
				</ul>
			</div>
		)
	}
	else if (props.mode === 'classic') {
		return(
			<div className="discription-game" style={start ? {display: 'none'} : {display: 'block'}} >
				<div className='discription-title' >Welcome to 2D Pong! </div>
				<br /> This is a classic arcade game inspired by the original 1972 Pong. The objective is simple: prevent the ball from getting past your paddle while trying to outmaneuver your opponent.<br />
				<ul>
					<li>the Player can controls  paddles and can use the arrow keys up and down to move. </li>
					<li>The first player to reach 5 points wins the game. </li>
					<li>Get ready to test your reflexes and enjoy this nostalgic journey back to the origins of video gaming! Good luck! </li>
				</ul>
			</div>
		)
	}
	else if (props.mode === 'akinator') {
		return(
			<div className="discription-game" style={start ? {display: 'none'} : {display: 'block'}} >
				<div className='discription-title' >Welcome to Akinator Training Mode!</div>
				<br /> An engaging feature that allows you to hone your skills against Akinator, while experiencing an immersive Arabesque-themed environment.<br />  
				<ul>
					<li>You control the paddle using the arrow keys. Press the up arrow to move the paddle up and the down arrow to move it down. </li>
					<li>Immerse yourself in the enchanting Arabesque setting and sharpen your Pong skills with this exciting training experience. Good luck! </li>
				</ul>
			</div>
		)
	}
}