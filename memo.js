let allMemo = JSON.parse(localStorage.getItem("allMemo")); //로컬의 allmemo라는 키를 가진 값 호출
allMemo = allMemo ?? []; //올메모 널이라면 빈배열 반환
const tags = ['def', 'thk', 'imp']
const taglist = document.querySelector('.tags');
let selected = taglist.querySelector('.tag-def');

render();

//태그 지정하기
function setTag() {
    const makeBtn = document.querySelector('.btn-make');
    const catBox = document.querySelector('.cat-box');

    taglist.addEventListener('click', function (e) {
        taglist.querySelectorAll("li[class^='tag']").forEach((item) => item.classList.remove('tag-def', 'tag-thk', 'tag-imp')); //태그 초기화
        makeBtn.classList.remove( `fill-def`,'fill-thk','fill-imp');

        selected = e.target.closest('li');
        for (let tag of tags) {
            if (selected && selected.classList.contains(`tag-${tag}-disable`)) {
                selected.classList.add(`tag-${tag}`)
                makeBtn.classList.add( `fill-${tag}`);
                catBox.style.backgroundImage = `url(./images/cat-${tag}.png)`
            }
        }

    })

}
setTag();


//메모 저장하기
function saveNote() {
    //제목, 내용 인풋 가져오기
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const tagName = selected.getAttribute('class').slice(-3)

    //올메모에 객체 형태의 한메모를 요소 하나로 푸시하기 (len은 인덱스 번호)
    if (title && content) {
        allMemo.push({
            title,
            content,
            len: allMemo.length,
            tag: tagName
        });
    } else {}

    //올메모를 문자열로 변환해서 로컬에 넣기
    localStorage.setItem("allMemo", JSON.stringify(allMemo));
    render();
}

//렌더하기 (목록에 로컬에 있는 것들 넣기 )
function render() {
    const display = document.getElementById("display");
    display.innerHTML = ""; //초기화


    //최신 게시물이 위로 올라오도록
    for (let i = allMemo.length; i > 0; i--) {

        const saveContainer = document.createElement("article");
        const saveTitle = document.createElement("h2");
        const saveContent = document.createElement("p");
        const deleteMemoBtn = document.createElement("button");

        //각각 제목,내용 넣기
        saveTitle.textContent = allMemo[i - 1].title;
        saveContent.textContent = allMemo[i - 1].content;

        //컨테이너
        saveContainer.setAttribute("class", "bubble")
        //태그에 따라서 class다르게 해서 말풍선 모양이 다름
        saveContainer.classList.add(`bubble-${allMemo[i - 1].tag}`)

        //삭제버튼 구성 index를 id로 줘서 삭제할 수 있도록
        deleteMemoBtn.classList.add("x")
        deleteMemoBtn.setAttribute("id", allMemo[i - 1].len);
        deleteMemoBtn.setAttribute("onclick", "remove()");

        //디스플레이 안에 넣기 순서대로 들어감
        saveContainer.append(saveTitle, saveContent, deleteMemoBtn);
        display.appendChild(saveContainer);

        // 높이에 따른 클래스
        if(saveContent.clientHeight >= 100){
            saveContainer.closest('article').classList.add('big');
        } else{
            saveContainer.closest('article').classList.add('small');
        }

        // line 높이 지정
        const line = document.querySelector('.line');
        line.style.height = display.clientHeight + 'px';

    }
}

//삭제하기
function remove() {
    console.log(event.srcElement.id); //id는 인덱스 번호

    //.find() - 맞는 첫번째 값만 리턴 (삭제할 아이템을 올메모 배열에서 찾기)
    const idx = allMemo.find(
        (item) => item.len == event.srcElement.id
    );

    //찾았으면 
    if (idx) {
        //해당 인덱스부터 1개 삭제 (걍 본인을 삭제)
        allMemo.splice(
            allMemo.findIndex((item) => item.len == idx.len),
            1
        );
    }

    //올메모 배열을 문자열로 만들어서 로컬에 넣기
    localStorage.setItem("allMemo", JSON.stringify(allMemo));
    //바꼈으니 렌더링
    render();
}

//필터링하기