"use strict";
(function() {

    /**
     * Класс демонстрирующий синхронизацию текста введенного offline
     * @class
     */
    class ModelSync {

        /**
         * Инициализируем Swarm.ja сервер и обработчики событий
         * @constructor
         */
        constructor () {
            let swarm = require('swarm')
                , Model = require('./data_types/model.js')
                , id = Math.round(new Date().getTime() * Math.random() * 1000000)
                , swarm_host = new swarm.Host(id);

            this.input = document.querySelector('textarea');
            this.model = new Model('APP');
            this.model.on(this.eventMonitor.bind(this));
            this.textChangedBind = this.textChanged.bind(this);

            swarm_host.connect('ws://localhost:8000/');
            window.addEventListener('onbeforeunload', this.turnOff.bind(this));
        }

        /**
         * События, которые возникают у Модели
         */
        eventMonitor (spec, val, source) {
            if (spec.op() == 'init') {
                this.textInitialized();
            }
        }

        /**
         * При инициализации Модели добавляем текстовому полю событие,
         * отслеживающее изменение текста в нем, и вводим в поле текст
         * из Модели
         */
        textInitialized () {
            this.input.value = this.model.text;
            this.model.on('set', this.textUpdate.bind(this));
            this.input.removeEventListener('keyup', this.textChangedBind);
            this.input.addEventListener('keyup', this.textChangedBind);
            this.input.removeAttribute('disabled');
        }

        /**
         * Получили информацию о том, что кто то изменил Модель
         */
        textUpdate () {
            if (this.model.text != this.input.value) {
                this.input.value = this.model.text;
            }
        }

        /**
         * Пользователь изменил текст. Сохраняем изменения в Модели.
         */
        textChanged () {
            if (this.model.text != this.input.value) {
                this.model.text = this.input.value;
                this.model.save();
            }
        }

        /**
         * Перед закрытием вкладки браузера закрываем соединение с сервером
         */
        turnOff () {
            swarm_host.close();
        }

    }

    let ready = new Promise((resolve, reject) => {
        if (document.readyState != "loading") return resolve();
        document.addEventListener("DOMContentLoaded", () => resolve());
    });

    ready.then(()=>{
        new ModelSync;
    });

})();
