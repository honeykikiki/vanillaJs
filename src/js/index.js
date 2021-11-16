// step2 요구사항 - 상태 관리로 메뉴 관리하기

//  품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
import { $ } from './utils/dom.js';
import { store } from './store/index.js';

function App() {
  // 상태는 변하는 데이터, 이앱에서 변하는 데이터는 무엇인가 = 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';

  this.init = () => {
    if (store.getLocalStorage()?.length > 1) {
      this.menu = JSON.parse(store.getLocalStorage());
    }
    render();
    initEventListener();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `<li data-menu-id='${index}' class=" menu-list-item d-flex items-center py-2">
                  <span class="w-100 pl-2 menu-name ${
                    item.soldOut ? 'sold-out' : ''
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
      .join('');

    $('#menu-list').innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const addCoffeMenuName = () => {
    if ($('#menu-name').value === '') {
      return;
    }
    const muneName = $('#menu-name').value;
    this.menu[this.currentCategory].push({ name: muneName });
    store.setLocalStorage(this.menu);
    render();
    $('#menu-name').value = '';
  };

  const updateMuneName = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedName = prompt('수정할 값을 입력해주세요', $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = (e) => {
    if (confirm('삭제하시겠습니까?')) {
      const menuId = e.target.closest('li').dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListener = () => {
    $('#menu-list').addEventListener('click', (e) => {
      // 수정
      if (e.target.classList.contains('menu-edit-button')) {
        updateMuneName(e);
        return;
      }
      // 삭제
      if (e.target.classList.contains('menu-remove-button')) {
        removeMenuName(e);
        return;
      }
      // 품절
      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenu(e);
        return;
      }
    });

    $('#menu-form').addEventListener('submit', (e) => {
      e.preventDefault();
    });

    $('#menu-submit-button').addEventListener('click', addCoffeMenuName);

    $('#menu-name').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addCoffeMenuName();
        return;
      }
    });

    $('nav').addEventListener('click', (e) => {
      // e.preventDefault();
      const isCategoryButton =
        e.target.classList.contains('cafe-category-name');
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
        render();
        return;
      }
    });
  };
}

const app = new App();
app.init();
