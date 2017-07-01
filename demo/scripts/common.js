var codes = document.querySelectorAll('.code'),
	styling = document.querySelector('.styling');

tastySelect({
	defaultText: "Можешь выбрать покушать! (Ctrl+Click)",
});

styling.addEventListener('change', function(event){
	inputCheck(event.target);
},false);

for(var i = 0, length = codes.length; i < length; i++){
	code = codes[i];
	code.innerHTML = Syntax(code.innerHTML);
}

function Syntax(code){
	var comments	= [];	// Тут собираем все каменты
	var strings		= [];	// Тут собираем все строки
	var res			= [];	// Тут собираем все RegExp
	var all			= { 'C': comments, 'S': strings, 'R': res };
	var safe		= { '<': '<', '>': '>', '&': '&' };

	return code
	// Маскируем HTML
		.replace(/[<>&]/g, function (m)
			{ return safe[m]; })
	// Убираем каменты
		.replace(/\/\*[\s\S]*\*\//g, function(m)
			{ var l=comments.length; comments.push(m); return '~~~C'+l+'~~~';   })
		.replace(/([^\\])\/\/[^\n]*\n/g, function(m, f)
			{ var l=comments.length; comments.push(m); return f+'~~~C'+l+'~~~'; })
	// Убираем regexp
		.replace(/\/(\\\/|[^\/\n])*\/[gim]{0,3}/g, function(m)
			{ var l=res.length; res.push(m); return '~~~R'+l+'~~~';   })
	// Убираем строки
		.replace(/([^\\])((?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*"))/g, function(m, f, s)
			{ var l=strings.length; strings.push(s); return f+'~~~S'+l+'~~~'; })
	// Выделяем ключевые слова
		.replace(/(var|function|typeof|new|return|if|for|in|while|break|do|continue|switch|case)([^a-z0-9\$_])/gi,
			'<span class="kwrd">$1</span>$2')
	// Выделяем скобки
		.replace(/(\{|\}|\]|\[|\|)/gi,
			'<span class="gly">$1</span>')
	// Выделяем имена функций
		.replace(/([a-z\_\$][a-z0-9_]*)[\s]*\(/gi,
			'<span class="func">$1</span>(')
	// Возвращаем на место каменты, строки, RegExp
		.replace(/~~~([CSR])(\d+)~~~/g, function(m, t, i)
			{ return '<span class="'+t+'">'+all[t][i]+'</span>'; })
	// Выставляем переводы строк
		.replace(/\n/g,
			'<br/>')
	// Табуляцию заменяем неразрывными пробелами
		.replace(/\t/g,
			'&nbsp;&nbsp;&nbsp;&nbsp;');
}

function inputCheck(elem){
	var select = document.querySelector('select').parentNode,
		className = elem.getAttribute('data-class'),
		isMobile=select.classList.contains('is_mobile')?'is_mobile':'';

	select.setAttribute('class','');
	select.classList.add('style-select', className);
	if(isMobile){
		select.classList.add(isMobile);
	}
}
inputCheck(document.querySelectorAll("[name=styling]")[0]);