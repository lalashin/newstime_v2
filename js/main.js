//const API_KEY = 'c42962f8d2ff47bfaa629c992b467868';
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click",(event) =>getNewsCategory(event)));
//console.log(menus)
let searchInput = document.getElementById("search-input");
let searchResult = document.getElementById("search-result")
let newsBoard = document.getElementById("news-board");
let pagiNation = document.querySelector(".pagination")

let url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`);
let keyword = "";
let totalResults = 0;
let page = 1;
const pageSize =10;
const groupSize =5;

const getNews = async () => {
    try{
        url.searchParams.set("page",page); // => &page=pgae
        url.searchParams.set("pageSize",pageSize);
        const response = await fetch(url);
       
        console.log("rrr",response)
        const data = await response.json();
        console.log("ddd",data)
        console.log("keyword",keyword)
       if(response.status === 200){
            if(data.articles.length === 0){
                throw new Error ("No result for this search");
            }
            if(keyword !== ""){
                searchResult.textContent = `"${keyword}" 검색결과  ${data.totalResults}건 `;
            } else {                
                searchResult.textContent = "";
            }
        newsList = data.articles;
        totalResults = data.totalResults;
        searchInput.value = "";
        keyword ="";
        render();
        pagenationRender();
       } else {
        throw new Error (data.message);
       }
        
    } catch(error) {
        console.log("error",error.message);
        errorRender(error.message);
    }
   
};

const getLatesNews = async () =>{
    url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`);
    //console.log(url)
    getNews();

};

const getNewsCategory = async (event)=>{
    const category = event.target.textContent.toLowerCase();
    console.log("category",category);
    url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?category=${category}`);
    getNews();
};

const getNewsByKeyword = async () => {
    
    keyword = searchInput.value;
    
   
    url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines&q=${keyword}`);
    getNews();
   
};

const render =() =>{
    
    
    const newsHTML = newsList.map(news=>`<div class="news row bt_line">
    <div class="col-lg-4">
        <img src="${news.urlToImage}" class="news-img-size" alt="">
    </div>
    <div class="col-lg-8">
        <a href="${news.url}" target="_blank" class="title">${news.title}</a>
        <p>${news.description}</p>
        <div>${news.source.name} * ${news.publishedAt}</div>
    </div>
</div>`).join('');

//console.log("html:",newsHTML)
newsBoard.innerHTML = newsHTML;

};

const errorRender =(errorMessage)=> {
   const errorHtml = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`;
  newsBoard.innerHTML = errorHtml;
};

const pagenationRender=()=>{
    //totalResult,
    //page
    //pageSize
    //groupSize
    //totalPages
   const totalPages = Math.ceil(totalResults/pageSize);
    //pageGroup
    const pageGroup = Math.ceil(page/groupSize);
    //lastPage
    let lastPage = pageGroup * groupSize;
    //마지막 페이지그룹이 그룹사이즈보다 작다? lastpage = totalpage
    if(lastPage>totalPages){
        lastPage=totalPages;
    }
    //firstPage
    let firstPage = lastPage - (groupSize-1) <= 0 ? 1 :  lastPage - (groupSize-1) ;
    let paginationHTML = ``;
    if(page >= 6) {
            paginationHTML =`
                <li class="page-item" onclick="moveToPage(1)">
                                <a class="page-link" >&lt;&lt;</a>
                            </li>
                <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link">&lt;</a></li>
            `;

    }
        
     

    for(let i=firstPage;i<=lastPage;i++){
        paginationHTML += `<li class="page-item ${i===page ? "active" : ''}"  onclick="moveToPage(${i})" ><a class="page-link">${i}</a></li>`
    }
    if (lastPage < totalPages) {
        paginationHTML += `
        <li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link">&gt;</a></li>
        <li class="page-item" onclick="moveToPage(${totalPages})">
                        <a class="page-link" >&gt;&gt;</a>
                      </li>
    `;
    }
   
    pagiNation.innerHTML = paginationHTML;

    // <li class="page-item">
    //   <a class="page-link" href="#" aria-label="Previous">
    //     <span aria-hidden="true">&laquo;</span>
    //   </a>
    // </li>
    // <li class="page-item"><a class="page-link" href="#">1</a></li>
    // <li class="page-item"><a class="page-link" href="#">2</a></li>
    // <li class="page-item"><a class="page-link" href="#">3</a></li>
    // <li class="page-item">
    //   <a class="page-link" href="#" aria-label="Next">
    //     <span aria-hidden="true">&raquo;</span>
    //   </a>
    // </li>

}
const moveToPage =(pageNum)=>{
    console.log("moveToPage",pageNum);
    page = pageNum;
    getNews()
}
getLatesNews()

//1. 버튼에 클릭이벤트
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스 보여주기