import { useEffect, useState } from 'react';
import './App.css';
import Botoes from './components/Botoes/Botoes'
import Grid from './components/Grid/Grid'
import MsgOverlay from './components/MsgOverlay/MsgOverlay'
import MobileInput from './components/MobileInput/MobileInput';

let temp_grid = [];
let count_repeated_row = []
let count_repeated_col = []
let quant_row = []
let quant_col = []
let side_grid_L = []
let side_grid_T = []
let side_grid_R = []
let side_grid_B = []
let grid_size
let ultimo_selecionado
let selecionado_mobile
let hard = false
let history = []
let history_pointer = -1
let from_input = true
//test

function App() {
	//main grid
	let [grid, setGrid] = useState([])
	//side grids
	let [tgrid, setTGrid] = useState([])
	let [lgrid, setLGrid] = useState([])	
	let [rgrid, setRGrid] = useState([])
	let [bgrid, setBGrid] = useState([])
	//restart/solve buttons enable
	let [disable_button, setButton] = useState(true)
	//overlay message
	let [message, setMsg] = useState("")
	//mobile input buttons
	let [buttons, setBtns] = useState([])
	//object para o undo/redo 
	const Step = {
		pos: '0',
		undo: '0',
		redo: '0'
	}	

	function createGrid (){
		//mostrar barra de input após escolher um modo de jogo
		let input_bar = document.getElementsByClassName('input__bg')[0]
		if (input_bar.classList.contains('before__start')) {
			input_bar.classList.toggle('before__start')
		}

		let undo = document.getElementsByClassName('undo')[0]
		let redo = document.getElementsByClassName('redo')[0]
		if (!undo.classList.contains('disabled')){
			document.getElementById('undo').classList.toggle('disabled')
		}
		if (!redo.classList.contains('disabled')){
			document.getElementById('redo').classList.toggle('disabled')
		}

		if (temp_grid.length){
			history = []
			history_pointer = -1
			temp_grid=[]
			let reset = document.querySelectorAll('.sqr.game')
			let reset_tips = document.querySelectorAll('.sqr.black')
			
			for (let i = 0; i < reset.length; i++) {
				reset[i].innerHTML = '';

				if (reset[i].classList.contains('red') == true){
					reset[i].classList.toggle('red')
				}

				if (reset[i].classList.contains('fim') == true) {
					reset[i].classList.toggle('fim')
				}

			}

			for (let i = 0; i < reset_tips.length; i++) {
				if (reset_tips[i].classList.contains('red') == true){
					reset_tips[i].classList.toggle('red')
				}
			}	
		}	
		
		count_repeated_row = Array(grid_size*grid_size).fill(0)
		count_repeated_col = Array(grid_size*grid_size).fill(0)
		quant_row = Array(grid_size).fill(0)
		quant_col = Array(grid_size).fill(0)
		setButton(false)

		let forbidden
		let temp_buttons = []

        for (let i = 1; i <= grid_size; i++) {
			forbidden = []
			temp_buttons[i] = i

			if (i == grid_size){
				for (let n = 0; n < grid_size*grid_size; n ++){
					if (temp_grid[n] == undefined) temp_grid[n] = i
				}
				break
			}

			for (let j = 0; j < grid_size; j++) {
				if (i > 1){
					for (let k = 0; k < grid_size; k++){
						if (forbidden[k] != i){
							forbidden[k] = temp_grid[j*grid_size+k]
						}
					}
				}

				if(!forbidden.includes(undefined) && forbidden.length == grid_size){
					temp_grid = temp_grid.map(item => item == i? undefined: item)
					forbidden = []
					j = (-1)
					continue
				}

				let index = Math.floor(Math.random() * grid_size)
            	
				while (forbidden[index] != undefined){ 
					index = Math.floor(Math.random() * grid_size)
				}

				temp_grid[(j)*grid_size+index] = i
				forbidden[index] = i
			}
        }
		
		console.log(temp_buttons)
		setBtns(temp_buttons)
        setGrid(temp_grid)
	}

	function choose4Grid(){
		message = 'Are you sure you want to start a new game?'
		setMsg(message)		
		let ovl = document.getElementsByClassName('overlay')[0]
		grid_size = 4
		hard = false
		
		if (temp_grid.length){
			ovl.style.display='block'
		}else{
			document.getElementById('grid').className = 'g4x4'
			createGrid()
			createSideGrid()
		}
    }

	function choose5Grid(){
		message = 'Are you sure you want to start a new game?'
		setMsg(message)	
		let ovl = document.getElementsByClassName('overlay')[0]
		grid_size = 5
		hard = false
		
		if (temp_grid.length){
			ovl.style.display='block'
		}else{
			document.getElementById('grid').className = 'g5x5'
			createGrid()
			createSideGrid()
		}
    }

	function choose5HardGrid(){
		message = 'Are you sure you want to start a new game?'
		setMsg(message)	
		let ovl = document.getElementsByClassName('overlay')[0]
		grid_size = 5
		hard = true
		
		if (temp_grid.length){
			ovl.style.display='block'
		}else{
			document.getElementById('grid').className = 'g5x5'
			createGrid()
			createSideGrid()
		}
	}

	function handleYes(){		
		document.getElementById('grid').className = `g${grid_size}x${grid_size}`
		createGrid()
		createSideGrid()
		closeOverlay()
	}

	function hardGame(clues, side, sg){
		let side_quant 			
		side_quant = clues[Math.floor(Math.random()*100%clues.length)]
		clues.splice(clues.indexOf(side_quant), 1)

		while (side_quant){
			let index = Math.floor(Math.random()*100%grid_size)
			if (side.at(index) == false){
				side[index] = sg[index]
				side_quant--
			}
		}

		return
	}

	function createSideGrid(){		
		if (side_grid_L){
			side_grid_L = Array(grid_size).fill(1)
			side_grid_T = Array(grid_size).fill(1)
			side_grid_R = Array(grid_size).fill(1)
			side_grid_B = Array(grid_size).fill(1)
		}

		let pivo
		
		for (let i = 0; i < grid_size; i++){
			pivo = temp_grid[i*grid_size]

			for (let j = 0; j < grid_size-1; j++) {
				if (pivo < temp_grid[i*grid_size+j+1]){
					side_grid_L[i] += 1
					pivo = temp_grid[i*grid_size+j+1]
				}
			}
		}

		for (let j = 0; j < grid_size; j++){
			pivo = temp_grid[j]

			for (let i = 0; i < grid_size-1; i++) {
				if (pivo < temp_grid[(i+1)*grid_size+j]){
					side_grid_T[j] += 1
					pivo = temp_grid[(i+1)*grid_size+j]
				}			
			}
		}

		for (let i = 0; i < grid_size; i++){
			pivo = temp_grid[i*grid_size+grid_size-1]

			for (let j = grid_size-1; j > 0; j--) {
				if (pivo < temp_grid[i*grid_size+j-1]){
					side_grid_R[i] += 1
					pivo = temp_grid[i*grid_size+j-1]
				}
			}
		}

		for (let j = 0; j < grid_size; j++){
			pivo = temp_grid[j+grid_size*(grid_size-1)]

			for (let i = grid_size-1; i > 0; i--) {
				if (pivo < temp_grid[(i-1)*grid_size+j]){
					side_grid_B[j] += 1
					pivo = temp_grid[(i-1)*grid_size+j]
				}			
			}
		}

		if (hard){
			let sideL = Array(grid_size).fill('')
			let sideT = Array(grid_size).fill('')
			let sideR = Array(grid_size).fill('')
			let sideB = Array(grid_size).fill('')
			//quantidade maxima de dicas(clues)
			let clues = [3, 3, 2, 2, 2]

			hardGame(clues, sideL, side_grid_L)		
			hardGame(clues, sideT, side_grid_T)	
			hardGame(clues, sideR, side_grid_R)	
			hardGame(clues, sideB, side_grid_B)		

			setLGrid(sideL)
			setTGrid(sideT)
			setRGrid(sideR)
			setBGrid(sideB)

			side_grid_L = sideL
			side_grid_T = sideT
			side_grid_R = sideR
			side_grid_B = sideB
			
			return
		}
		
		setLGrid(side_grid_L)
		setTGrid(side_grid_T)
		setRGrid(side_grid_R)
		setBGrid(side_grid_B)
	}

	function listaRodadas() {
        document.getElementsByClassName("menu__conteudo")[0].classList.toggle("show")
    }

    window.onclick = function (event) {
        if (!event.target.matches(".botao__novo_jogo")) {
            var menu = document.getElementsByClassName("menu__conteudo")
           
            for (let i = 0; i < menu.length; i++) {
                var abreMenu = menu[i];
                if (abreMenu.classList.contains("show")) {
                    abreMenu.classList.remove("show")
                }
            }
        }
    }

	function restart(){
		history = []
		history_pointer = -1
		count_repeated_row = Array(grid_size*grid_size).fill(0)
		count_repeated_col = Array(grid_size*grid_size).fill(0)
		quant_row = Array(grid_size).fill(0)
		quant_col = Array(grid_size).fill(0)
		let reset = document.querySelectorAll('.sqr.game')
		let reset_tips = document.querySelectorAll('.sqr.black')
		
		for (let i = 0; i < reset.length; i++) {
			reset[i].innerHTML = '';
			
			if (reset[i].classList.contains('red') == true){
				reset[i].classList.toggle('red')
			}

			if (reset[i].classList.contains('fim') == true) {
				reset[i].classList.toggle('fim')
			}

		}

		for (let i = 0; i < reset_tips.length; i++) {
			if (reset_tips[i].classList.contains('red') == true){
				reset_tips[i].classList.toggle('red')
			}
		}	
	}

	function solve(){
		restart()

		let result = document.querySelectorAll('.sqr.game')

		for (let i = 0; i < result.length; i++) {
			result[i].innerHTML = temp_grid[i]
			result[i].classList.toggle('fim')
		}

		message = "Game over! Start a new game?"
		handleWin()
	}
	
	function selectSquare(id){		
		if (ultimo_selecionado){
			ultimo_selecionado.classList.toggle("selecionado")
			if (ultimo_selecionado.id == id){
				ultimo_selecionado = null
				return
			}
		}
		ultimo_selecionado = document.getElementById(id)
		ultimo_selecionado.classList.toggle("selecionado")
	}
	
	function blurClick(){
		if (ultimo_selecionado){
			ultimo_selecionado.classList.toggle("selecionado")
			ultimo_selecionado = null
		}
	}
	
	function addRowRepeated(el){
		let row = Math.floor(el.id/grid_size)		
		let all_grid = document.getElementsByClassName('sqr game')		
		count_repeated_row[row*grid_size+Number(el.innerHTML)-1]++	

		if (count_repeated_row[row*grid_size+Number(el.innerHTML)-1] > 1){
			for (let i = 0; i < grid_size; i++) {
				if (all_grid[row*grid_size+i].innerHTML == el.innerHTML 
					&& all_grid[row*grid_size+i].classList.contains("red") == false){
					all_grid[row*grid_size+i].classList.toggle("red")
				}
			}
		}
	}

	function removeRowRepeated(el){
		if (el === undefined || el.innerHTML === '') return

		let row = Math.floor(el.id/grid_size)
		let all_grid = document.getElementsByClassName('sqr game')
		count_repeated_row[row*grid_size+Number(el.innerHTML)-1]--	

		if (count_repeated_row[row*grid_size+Number(el.innerHTML)-1] < 2){			
			for (let i = 0; i < grid_size; i++) {
				if (all_grid[row*grid_size+i].innerHTML == el.innerHTML
				&& all_grid[row*grid_size+i].classList.contains("red") == true){
					let col = all_grid[row*grid_size+i].id % grid_size
					
					if (count_repeated_col[col*grid_size+Number(el.innerHTML)-1] < 2){
						all_grid[row*grid_size+i].classList.toggle('red')
					}
				}
			}
		} else {
			el.classList.toggle("red")
		}
	}	

	function addColRepeated(el){
		let col = el.id % grid_size
		let all_grid = document.getElementsByClassName('sqr game')		
		count_repeated_col[col*grid_size+Number(el.innerHTML)-1]++	

		if (count_repeated_col[col*grid_size+Number(el.innerHTML)-1] > 1){
			for (let i = 0; i < grid_size; i++) {
				if (all_grid[i*grid_size+col].innerHTML == el.innerHTML 
					&& all_grid[i*grid_size+col].classList.contains("red") == false){
					all_grid[i*grid_size+col].classList.toggle("red")
				}
			}
		}
	}

	function removeColRepeated(el){
		if (el === undefined || el.innerHTML === '') return

		let col = el.id % grid_size
		let all_grid = document.getElementsByClassName('sqr game')		
		count_repeated_col[col*grid_size+Number(el.innerHTML)-1]--	

		if (count_repeated_col[col*grid_size+Number(el.innerHTML)-1] < 2){
			for (let i = 0; i < grid_size; i++) {
				if (all_grid[i*grid_size+col].innerHTML == el.innerHTML 
				&& all_grid[i*grid_size+col].classList.contains("red") == true){
					let row = Math.floor(all_grid[i*grid_size+col].id/grid_size)

					if (count_repeated_row[row*grid_size+Number(el.innerHTML)-1] < 2){
						all_grid[i*grid_size+col].classList.toggle("red")
					}
				}
			}
		} else {
			el.classList.toggle("red")
		}
	}

	//envia o input para o grid
	function valueToGrid(sel, value){
		if (value <= grid_size && value > 0){	
			if (from_input){
				let step = Object.create(Step)
				step.pos = sel[0].id
				step.undo = sel[0].innerHTML
				step.redo = value
				
				if (history_pointer < history.length-1){
					history.splice(history_pointer+1)
					document.getElementById('redo').classList.toggle('disabled')
				}

				history = history.concat(step)
				history_pointer++
				if (!history_pointer) document.getElementById('undo').classList.toggle('disabled')
			}
			
			if (sel[0].innerHTML == ''){
				quant_row[Math.floor(sel[0].id / grid_size)]++
				quant_col[sel[0].id % grid_size]++
			}

			removeRowRepeated(sel[0])
			removeColRepeated(sel[0])
			sel[0].innerHTML = value				
			addRowRepeated(sel[0])
			addColRepeated(sel[0])

			if (quant_row[Math.floor(sel[0].id / grid_size)] == grid_size){
				let temp = 1
				let all_grid = document.getElementsByClassName('sqr game')
				let pivo = all_grid[Math.floor(sel[0].id / grid_size)*grid_size].innerHTML
									
				// left
				for (let j = 0; j < grid_size-1; j++) {
					if (pivo < all_grid[Math.floor(sel[0].id / grid_size)*grid_size+j+1].innerHTML){
						temp++
						pivo = all_grid[Math.floor(sel[0].id / grid_size)*grid_size+j+1].innerHTML
					}
				}	
				//hard mode
				//somente left vazio
				if(side_grid_L[Math.floor(sel[0].id / grid_size)] == ''){
					temp = ''
				}

				let red = document.getElementsByClassName('left__tips')[0]

				//caso a ordem esteja errada e a dica não esteja vermelha, toggle red
				//ou caso a ordem esteja correta e a dica esteja vermelha, toggle red
				if ((temp != side_grid_L[Math.floor(sel[0].id / grid_size)] && 
				red.children[Math.floor(sel[0].id / grid_size)].classList.contains('red') == false) ||
				(temp == side_grid_L[Math.floor(sel[0].id / grid_size)] && 
				red.children[Math.floor(sel[0].id / grid_size)].classList.contains('red') == true)) {						
					red.children[Math.floor(sel[0].id / grid_size)].classList.toggle('red')
				}
				
				// right
				temp = 1
				pivo = all_grid[Math.floor(sel[0].id / grid_size)*grid_size+grid_size-1].innerHTML
				
				for (let j = grid_size-1; j > 0; j--) {
					if (pivo < all_grid[Math.floor(sel[0].id / grid_size)*grid_size+j-1].innerHTML){
						temp++
						pivo = all_grid[Math.floor(sel[0].id / grid_size)*grid_size+j-1].innerHTML
					}
				}				
				//hard mode
				//somente right vazio
				if(side_grid_R[Math.floor(sel[0].id / grid_size)] == ''){
					temp = ''
				}

				red = document.getElementsByClassName('right__tips')[0]
				
				//caso a ordem esteja errada e a dica não esteja vermelha, toggle red
				//ou caso a ordem esteja correta e a dica esteja vermelha, toggle red
				if ((temp != side_grid_R[Math.floor(sel[0].id / grid_size)] && 
				red.children[Math.floor(sel[0].id / grid_size)].classList.contains('red') == false) ||
				(temp == side_grid_R[Math.floor(sel[0].id / grid_size)] && 
				red.children[Math.floor(sel[0].id / grid_size)].classList.contains('red') == true)){
					red.children[Math.floor(sel[0].id / grid_size)].classList.toggle('red')
				}
			}
			
			if (quant_col[sel[0].id % grid_size] == grid_size){
				let temp = 1
				let all_grid = document.getElementsByClassName('sqr game')
				let pivo = all_grid[sel[0].id % grid_size].innerHTML
				
				// top			
				for (let i = 0; i < grid_size-1; i++) {
					if (pivo < all_grid[(i+1)*grid_size+(sel[0].id % grid_size)].innerHTML){
						temp++
						pivo = all_grid[(i+1)*grid_size+(sel[0].id % grid_size)].innerHTML
					}			
				}
				//somente top vazio
				if (side_grid_T[sel[0].id % grid_size] == ''){
					temp = ''
				}
				let red = document.getElementsByClassName('top__tips')[0]
				
				//caso a ordem esteja errada e a dica não esteja vermelha, toggle red
				//ou caso a ordem esteja correta e a dica esteja vermelha, toggle red
				if ((temp != side_grid_T[sel[0].id % grid_size] && 
				red.children[sel[0].id % grid_size].classList.contains('red') == false) ||
				(temp == side_grid_T[sel[0].id % grid_size] && 
				red.children[sel[0].id % grid_size].classList.contains('red') == true)){
					red.children[sel[0].id % grid_size].classList.toggle('red')
				}
				
				//bottom
				temp = 1
				pivo = all_grid[sel[0].id % grid_size+grid_size*(grid_size-1)].innerHTML

				for (let i = grid_size-1; i > 0; i--) {
					if (pivo < all_grid[(i-1)*grid_size+(sel[0].id % grid_size)].innerHTML){
						temp++
						pivo = all_grid[(i-1)*grid_size+(sel[0].id % grid_size)].innerHTML
					}			
				}		
				//somente bottom vazio
				if (side_grid_B[sel[0].id % grid_size] == ''){
					temp = ''
				}	

				red = document.getElementsByClassName('bottom__tips')[0]

				//caso a ordem esteja errada e a dica não esteja vermelha, toggle red
				//ou caso a ordem esteja correta e a dica esteja vermelha, toggle red
				if ((temp != side_grid_B[sel[0].id % grid_size] && 
				red.children[sel[0].id % grid_size].classList.contains('red') == false) ||
				(temp == side_grid_B[sel[0].id % grid_size] && 
				red.children[sel[0].id % grid_size].classList.contains('red') == true)){
					red.children[sel[0].id % grid_size].classList.toggle('red')
				}

				var fim = 0

				for (let i = 0; i < grid_size; i++) {
					console.log(fim)
					if (document.querySelectorAll('.red').length == 0 && 
					((fim += quant_row[i]) == grid_size*grid_size)){
						for (let i = 0; i < grid_size*grid_size; i++) {
							document.getElementsByClassName('sqr game')[i].classList.toggle('fim')
						}

						message = "Congratulations! You won! Start a new game?"
						handleWin()
					}
				}
			}				
		}
	}

	function removeFromGrid(sel, value){
		if (sel[0] !== undefined && (value === 'Delete' || value === 'Backspace')){
			removeRowRepeated(sel[0])
			removeColRepeated(sel[0])
			sel[0].innerHTML = ''		
			quant_row[Math.floor(sel[0].id / grid_size)]--
			quant_col[sel[0].id % grid_size]--		

			if (quant_row[Math.floor(sel[0].id / grid_size)] == grid_size-1){
				let red = document.getElementsByClassName('left__tips')[0]
				if (red.children[Math.floor(sel[0].id / grid_size)].classList.contains('red') == true){
					red.children[Math.floor(sel[0].id / grid_size)].classList.toggle('red')
				}

				red = document.getElementsByClassName('right__tips')[0]
				if (red.children[Math.floor(sel[0].id / grid_size)].classList.contains('red') == true){
					red.children[Math.floor(sel[0].id / grid_size)].classList.toggle('red')
				}					
			}

			if (quant_col[sel[0].id % grid_size] == grid_size-1){
				let red = document.getElementsByClassName('top__tips')[0]
				if (red.children[sel[0].id % grid_size].classList.contains('red') == true){
					red.children[sel[0].id % grid_size].classList.toggle('red')
				}

				red = document.getElementsByClassName('bottom__tips')[0]
				if (red.children[sel[0].id % grid_size].classList.contains('red') == true){
					red.children[sel[0].id % grid_size].classList.toggle('red')
				}
			}
		}	
	}
	//input do teclado 
	const inputValue = event => {
		let sel = document.getElementsByClassName("selecionado")
		
		if (sel.length > 0 && sel[0].innerHTML != event.key){
			valueToGrid(sel, event.key)	
			removeFromGrid(sel, event.key)					
		}		

		event.stopImmediatePropagation()
	}

	function handleUndo(value){
		let square = document.querySelectorAll('.sqr.game')
		console.log(history, history_pointer)
		
		from_input = false
		
		if (value == 'undo'){
			square = [square[history[history_pointer].pos]]

			if (history[history_pointer].undo == ''){
				removeFromGrid(square, 'Delete')
			}
			else{
				valueToGrid(square, history[history_pointer].undo)
			}
			//result[history[history_pointer].pos].innerHTML = history[history_pointer][value] 
			history_pointer--
			
			if (history_pointer == -1){
				document.getElementById('undo').classList.toggle('disabled')	
			}
			
			if (history_pointer == history.length-2){
				document.getElementById('redo').classList.toggle('disabled')
			}
		}else{
			history_pointer++
			square = [square[history[history_pointer].pos]]
			
			if (history[history_pointer].redo == ''){
				removeFromGrid(square, 'Delete')
			}
			else{
				valueToGrid(square, history[history_pointer].redo)
			}

			if (history_pointer == 0){
				document.getElementById('undo').classList.toggle('disabled')	
			}

			if (history_pointer == history.length-1){
				document.getElementById('redo').classList.toggle('disabled')
			}
		}

		from_input = true
	}

	function handleMobileInput(value){
		let sel = document.getElementsByClassName("selecionado")
		console.log(sel[0])
		if (sel.length > 0 && sel[0].innerHTML != value){
			valueToGrid(sel, value)
		}
	}

	function handleMobileDelete(){
		let sel = document.getElementsByClassName("selecionado")
		let value = 'Delete'
		removeFromGrid(sel, value)
	}

	function handleWin(){
		setMsg(message)
		let ovl = document.getElementsByClassName('overlay')[0]
		ovl.style.display='block'
	}

	function closeOverlay(){
		let ovl = document.getElementsByClassName('overlay')[0]
		ovl.style.display = 'none'
	}
	
	useEffect(()=>{
		document.addEventListener("keyup", inputValue)
	})
	
	return (
		<div className="App" >	
			<MsgOverlay
				closeOverlay = {closeOverlay}
				message = {message}
				handleYes = {handleYes}
			/>	
			<Botoes
				choose4Grid = {choose4Grid}
				choose5Grid = {choose5Grid}
				choose5HardGrid = {choose5HardGrid}
				listaRodadas = {listaRodadas}
				restart = {restart}
				solve = {solve}
				disable_button = {disable_button}
			/>
			<Grid
				grid = {grid}
				tgrid = {tgrid}
				lgrid = {lgrid}
				rgrid = {rgrid}
				bgrid = {bgrid}
				selectSquare = {selectSquare}
				blurClick = {blurClick}
			/>
			<MobileInput
				buttons = {buttons}
				handleUndo = {handleUndo}
				handleMobileInput = {handleMobileInput}
				handleMobileDelete = {handleMobileDelete}
			/>

		</div>
	);
}

export default App;