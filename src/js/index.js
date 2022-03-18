import { $ } from "./utils/dom.js";
import MenuApi from "./api/index.js";

function App() {
  // 상태는 변하는 데이터, 이앱에서 변하는 데이터는 무엇인가 = 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory,
    );
    render();
    initEventListener();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory,
    );

    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `<li data-menu-id='${
          item.id
        }' class=" menu-list-item d-flex items-center py-2">
                  <span class="w-100 pl-2 menu-name ${
                    item.isSoldOut ? "sold-out" : ""
                  }">${item.name}</span>
                    <button
                      type="button"
                      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
                    >
                      품절
                    </button>
                  <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
                  >
                    삭제
                  </button>
                </li>`;
      })
      .join("");

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addCoffeMenuName = async () => {
    if ($("#menu-name").value === "") {
      return;
    }
    const duplicatedItem = this.menu[this.currentCategory].find(
      (item) => item.name === $("#menu-name").value,
    );
    if (duplicatedItem) {
      alert("이미 등록된 메뉴명입니다");
      $("#menu-name").value = "";

      return;
    }
    const muneName = $("#menu-name").value;

    await MenuApi.createMenu(this.currentCategory, muneName);

    render();
    $("#menu-name").value = "";
  };

  const updateMuneName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedName = prompt("수정할 값을 입력해주세요", $menuName.innerText);

    await MenuApi.updataMenu(this.currentCategory, updatedName, menuId);
    // this.menu[this.currentCategory][menuId].name = updatedName;
    // store.setLocalStorage(this.menu);1

    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;

      await MenuApi.deleteMenu(this.currentCategory, menuId);

      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory] = await MenuApi.toggleSoldOutMenu(
      this.currentCategory,
      menuId,
    );

    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;

      render();
    }
  };

  const initEventListener = () => {
    $("#menu-list").addEventListener("click", (e) => {
      // 수정
      if (e.target.classList.contains("menu-edit-button")) {
        updateMuneName(e);
        return;
      }
      // 삭제
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      // 품절
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addCoffeMenuName);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addCoffeMenuName();
        return;
      }
    });

    $("nav").addEventListener("click", changeCategory);
  };
}

const app = new App();
app.init();
