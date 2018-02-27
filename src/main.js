/* global window, Image */
import Mads from 'mads-custom';
// import ScrollSnap from 'scroll-snap';
import $ from 'jquery';
import './main.css';

class AdUnit extends Mads {
  render() {
    this.selected = [this.resolve(this.data.iceblendpink), this.resolve(this.data.pizza)];
    return `
    <div id="ad-container">
      <div id="first">
        <div id="selections">
          <div id="left-selection">
            <div class="item checked"><img src="${this.data.iceblendpink}" /></div>
            <div class="item"><img src="${this.data.iceblendchoco}" /></div>
            <div class="item"><img src="${this.data.iceblendmocca}" /></div>
            <div class="item"><img src="${this.data.stroberiSmooth}" /></div>
            <div class="item"><img src="${this.data.teaCup}" /></div>
          </div>
          <div id="right-selection">
            <div class="item checked"><img src="${this.data.pizza}" /></div>
            <div class="item"><img src="${this.data.potatoBucket}" /></div>
            <div class="item"><img src="${this.data.garlicBread}" /></div>
            <div class="item"><img src="${this.data.potato}" /></div>
            <div class="item"><img src="${this.data.bread}" /></div>
          </div>
        </div>
        <img id="plus" src="${this.data.plus}" />
        <img id="logo" src="${this.data.logo}" />
        <img id="btnPilih" src="${this.data.btnPilih}" />
      </div>
      <div id="second">
        <img src="${this.data.bgFullScroll}" />
        <div id="selected"></div>
        <img src="${this.data.allMenu}" />
      </div>
    </div>
    `;
  }

  style() {
    return [`
      #first {
        margin: 0;
        padding: 0;
        position: absolute;
        width: 320px;
        height: 480px;
        background: url(${this.resolve(this.data.bg1)})
      }

      #second {
        margin: 0;
        padding: 0;
        position: absolute;
        width: 320px;
        height: 480px;
        top: 0;
        left: 0;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        display: none;
      }

      .item.checked::after {
        content: ' ';
        background: url(${this.resolve(this.data.checked)});
        height: 39px;
        width: 36px;
        position: absolute;
        left: 35px;
        top: 5px;
      }
    `];
  }

  events() {
    const leftItems = this.elems['left-selection'].querySelectorAll('.item');
    const rightItems = this.elems['right-selection'].querySelectorAll('.item');
    leftItems.forEach((item) => {
      item.addEventListener('mousedown', () => {
        const el = this.elems['left-selection'].querySelector('.item.checked');
        el.className = el.className.replace(' checked', '');
        item.className += ' checked';
        this.selected[0] = item.childNodes[0].src;
        this.tracker('E', 'left_select');
      });
    });

    rightItems.forEach((item) => {
      item.addEventListener('mousedown', () => {
        const el = this.elems['right-selection'].querySelector('.item.checked');
        el.className = el.className.replace(' checked', '');
        item.className += ' checked';
        this.selected[1] = item.childNodes[0].src;
        this.tracker('E', 'right_select');
      });
    });

    this.elems.btnPilih.addEventListener('mousedown', () => {
      this.elems.first.style.display = 'none';
      this.elems.second.style.display = 'block';
      this.tracker('E', 'choose');

      let overscroll;
      let overNumber;

      $(this.elems.second).on('mousedown touchstart', () => {
        overscroll = false;
        overNumber = 0;
      });

      $(this.elems.second).on('mouseup touchend', () => {
        overscroll = false;
        overNumber = 0;
      });

      $(this.elems.second).on('mousemove touchmove', () => {
        if (this.elems.second.scrollHeight - this.elems.second.scrollTop
          === this.elems.second.clientHeight) {
          overscroll = true;
        }
        if (overscroll) {
          overNumber += 1;
        }
        if (overNumber >= 10) {
          overscroll = false;
          overNumber = 0;
        }
      });

      $(this.elems.second).on('scroll', () => {
        this.tracker('E', 'scroll');
        if (this.elems.second.scrollHeight - this.elems.second.scrollTop
          === this.elems.second.clientHeight) {
          overscroll = true;
          this.tracker('CTR', 'landing_page');
          this.tracker('E', 'landing_page');
          this.linkOpener('https://www.pizzahut.co.id/promosi/menu-baru/happy-hour');
          $(this.elems.second).stop().animate({ scrollTop: 560 }, 200, 'swing');
        }
      });


      const left = new Image();
      left.src = this.selected[0];
      const right = new Image();
      right.src = this.selected[1];
      this.elems.selected.appendChild(left);
      this.elems.selected.appendChild(right);
    });
  }
}

window.ad = new AdUnit();
