// =========================
// CONFIGURAÇÕES
// =========================

var velocidade = 1;

var velocidadeJogador = 5;

var velocidadePulo = 5;

var direita = false;

var esquerda = false;

var jogando = false;


// =========================
// RECORDE
// =========================

var recorde = localStorage.getItem("recorde");

if (recorde === null) {
    recorde = 0;
}

recorde = Number(recorde);

document.querySelector("#recorde").innerHTML = recorde;


// =========================
// CENÁRIO
// =========================

const cenario = {

    left: 0,

    jogo: document.querySelector("#jogo"),


    movimentar() {

        this.left = this.left - velocidade;

        this.jogo.style.backgroundPositionX =
            this.left + "px";
    },


    atualizarCenario(pontos) {

        var novoFundo;


        if (pontos < 50) {

            novoFundo =
                "url('assets/img/cenario.png')";

        } else if (pontos < 100) {

            novoFundo =
                "url('assets/img/cenario2.png')";

        } else if (pontos < 150) {

            novoFundo =
                "url('assets/img/cenario3.png')";

        } else {

            novoFundo =
                "url('assets/img/cenario4.png')";
        }


        if (this.jogo.style.backgroundImage !== novoFundo) {

            this.jogo.style.backgroundImage =
                novoFundo;
        }
    },


    verificarGameOver() {

        if (personagem.vidas <= 0) {

            jogando = false;

            document.querySelector("#pontuacaoFinal").innerHTML =
                personagem.pontos;

            document.querySelector("#recordeFinal").innerHTML =
                recorde;

            document.querySelector("#gameOver").style.display =
                "block";
        }
    }
};


// =========================
// VILÃO
// =========================

const vilao = {

    right: -80,

    item: document.querySelector("#vilao"),

    colidiu: false,


    movimentar() {

        this.right =
            this.right + velocidade;

        this.item.style.right =
            this.right + "px";


        var larguraJogo =
            cenario.jogo.offsetWidth;


        // Quando o vilão sai da tela
        if (this.right > larguraJogo) {

            this.right = -80;

            this.item.style.right = "-80px";

            this.colidiu = false;


            // Ganha 10 pontos
            personagem.pontos =
                personagem.pontos + 10;


            // Aumenta a velocidade
            // a cada 50 pontos
            if (personagem.pontos % 50 === 0) {

                velocidade =
                    velocidade + 1;
            }


            document.querySelector("#pontos").innerHTML =
                personagem.pontos;
        }


        // Atualiza recorde
        if (personagem.pontos > recorde) {

            recorde =
                personagem.pontos;

            localStorage.setItem(
                "recorde",
                recorde
            );

            document.querySelector("#recorde").innerHTML =
                recorde;
        }
    },


    colisao() {

        var posJogador =
            personagem.item.getBoundingClientRect();

        var posVilao =
            this.item.getBoundingClientRect();


        if (
            !this.colidiu &&

            posJogador.right >
            posVilao.left &&

            posJogador.left <
            posVilao.right &&

            posJogador.bottom >
            posVilao.top &&

            posJogador.top <
            posVilao.bottom
        ) {

            this.colidiu = true;


            // Perde uma vida
            personagem.vidas =
                personagem.vidas - 1;


            // Reinicia posição do vilão
            this.right = -80;

            this.item.style.right =
                "-80px";


            // Coloca personagem no chão
            personagem.bottom = 70;

            personagem.item.style.bottom =
                "70px";

            personagem.pular = false;


            // Remove vida
            if (personagem.vidas === 2) {

                document.querySelector("#vida3")
                    .style.display = "none";

            } else if (personagem.vidas === 1) {

                document.querySelector("#vida2")
                    .style.display = "none";

            } else if (personagem.vidas === 0) {

                document.querySelector("#vida1")
                    .style.display = "none";
            }
        }
    }
};


// =========================
// PERSONAGEM
// =========================

const personagem = {

    pontos: 0,

    vidas: 3,

    bottom: 70,

    left: 0,

    pular: false,

    item: document.querySelector("#personagem"),


    iniciar() {

        this.left =
            this.item.offsetLeft;

        this.bottom = 70;

        this.item.style.bottom =
            "70px";
    },


    movimentar() {

        // Direita
        if (direita === true) {

            this.frente();
        }


        // Esquerda
        if (esquerda === true) {

            this.tras();
        }


        // Pulo
        if (this.pular === true) {

            if (this.bottom < 280) {

                this.subir();

            } else {

                this.pular = false;
            }

        } else {

            // Gravidade
            if (this.bottom > 70) {

                this.descer();
            }
        }
    },


    frente() {

        this.left =
            this.left + velocidadeJogador;


        var limite =
            cenario.jogo.offsetWidth -
            this.item.offsetWidth;


        if (this.left > limite) {

            this.left = limite;
        }


        this.item.style.left =
            this.left + "px";
    },


    tras() {

        this.left =
            this.left - velocidadeJogador;


        if (this.left < 0) {

            this.left = 0;
        }


        this.item.style.left =
            this.left + "px";
    },


    subir() {

        this.bottom =
            this.bottom + velocidadePulo;


        if (this.bottom > 280) {

            this.bottom = 280;
        }


        this.item.style.bottom =
            this.bottom + "px";
    },


    descer() {

        this.bottom =
            this.bottom - velocidadePulo;


        if (this.bottom < 70) {

            this.bottom = 70;
        }


        this.item.style.bottom =
            this.bottom + "px";
    }
};


// =========================
// LOOP DO JOGO
// =========================

setInterval(function () {

    if (jogando === true) {

        cenario.movimentar();

        vilao.movimentar();

        personagem.movimentar();

        vilao.colisao();

        cenario.verificarGameOver();

        cenario.atualizarCenario(
            personagem.pontos
        );
    }

}, 10);


// =========================
// TECLAS PRESSIONADAS
// =========================

document.addEventListener(
    "keydown",
    function (event) {

        if (jogando === true) {

            // Direita
            if (event.code === "ArrowRight") {

                direita = true;
            }


            // Esquerda
            if (event.code === "ArrowLeft") {

                esquerda = true;
            }


            // Espaço = pular
            if (event.code === "Space") {

                if (personagem.bottom <= 70) {

                    personagem.pular = true;
                }

                event.preventDefault();
            }
        }
    }
);


// =========================
// TECLAS SOLTAS
// =========================

document.addEventListener(
    "keyup",
    function (event) {

        if (event.code === "ArrowRight") {

            direita = false;
        }


        if (event.code === "ArrowLeft") {

            esquerda = false;
        }
    }
);


// =========================
// BOTÃO JOGAR
// =========================

document.querySelector(
    "#botaoJogar"
).addEventListener(
    "click",
    function () {

        document.querySelector(
            "#inicio"
        ).style.display = "none";


        document.querySelector(
            "#jogo"
        ).style.display = "block";


        jogando = true;


        personagem.iniciar();
    }
);


// =========================
// BOTÃO JOGAR NOVAMENTE
// =========================

document.querySelector(
    "#botaoNovamente"
).addEventListener(
    "click",
    function () {

        // Pontos
        personagem.pontos = 0;


        // Vidas
        personagem.vidas = 3;


        // Velocidade
        velocidade = 1;


        // Teclas
        direita = false;
        esquerda = false;


        // Vilão
        vilao.right = -80;

        vilao.item.style.right =
            "-80px";

        vilao.colidiu = false;


        // Personagem
        personagem.bottom = 70;

        personagem.pular = false;

        personagem.item.style.bottom =
            "70px";


        // Reinicia posição horizontal
        personagem.left =
            personagem.item.offsetLeft;


        // Cenário
        cenario.left = 0;

        cenario.jogo.style.backgroundPositionX =
            "0px";

        cenario.jogo.style.backgroundImage =
            "url('assets/img/cenario.png')";


        // Pontuação
        document.querySelector(
            "#pontos"
        ).innerHTML = "0";


        // Vidas
        document.querySelector(
            "#vida1"
        ).style.display = "block";

        document.querySelector(
            "#vida2"
        ).style.display = "block";

        document.querySelector(
            "#vida3"
        ).style.display = "block";


        // Esconde Game Over
        document.querySelector(
            "#gameOver"
        ).style.display = "none";


        // Começa novamente
        jogando = true;
    }
);
