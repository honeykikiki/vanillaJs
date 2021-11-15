// step1
// Todo 메뉴 추가
//  에스프레소 메뉴에 새로운 메뉴를 확인 버튼 또는 엔터키 입력으로 추가한다.
//  메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
//  추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
//  총 메뉴 갯수를 count하여 상단에 보여준다.
//  사용자 입력값이 빈 값이라면 추가되지 않는다.

// Todo 메뉴 수정
//  메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
//  모달창에서 신규 메뉴명을 입력한다
//  메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.

// Todo 메뉴 삭제
//  메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다. 메뉴삭제 컨펌 모달창이 뜬다
//  메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
//  총 메뉴 갯수를 count하여 상단에 보여준다.

const $ = (selector) => document.querySelector(selector);

function app() {
  const updateMenuCount = () => {
    const menuCount = $('#espresso-menu-list').querySelectorAll('li').length;

    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const addCoffeMenuName = () => {
    if ($('#espresso-menu-name').value === '') {
      return;
    }
    const espressoMuneName = $('#espresso-menu-name').value;
    const menuItemTempleate = (espressoMuneName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
                  <span class="w-100 pl-2 menu-name">${espressoMuneName}</span>
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
    };

    $('#espresso-menu-list').insertAdjacentHTML(
      'beforeend',
      menuItemTempleate(espressoMuneName),
    );
    updateMenuCount();
    $('#espresso-menu-name').value = '';
  };

  const updateMuneName = (e) => {
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedName = prompt('수정할 값을 입력해주세요', $menuName.innerText);
    $menuName.innerText = updatedName;
  };

  const removeMenuName = (e) => {
    if (confirm('삭제하시겠습니까?')) {
      e.target.closest('li').remove();
      updateMenuCount();
    }
  };

  $('#espresso-menu-list').addEventListener('click', (e) => {
    // 수정
    if (e.target.classList.contains('menu-edit-button')) {
      updateMuneName(e);
    }
    // 삭제
    if (e.target.classList.contains('menu-remove-button')) {
      removeMenuName(e);
    }
  });

  $('#espresso-menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });

  $('#espresso-menu-submit-button').addEventListener('click', addCoffeMenuName);

  $('#espresso-menu-name').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addCoffeMenuName();
    }
  });
}

app();
