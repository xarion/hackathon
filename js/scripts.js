var background_music = new Audio('audio/background.mp3')
var slash_audio = new Audio('audio/battle/sword-unsheathe.wav');
var bow_audio = new Audio('audio/battle/swing3.wav');
var giant_hurt_audio = new Audio('audio/NPC/giant/giant3.wav');
var player = "#p1";
var skeleton = "#p2";

var stimuli_root = "graphics/items/";
var stimuli_list = ["gemBlue.png", "gemGreen.png", "gemRed.png", "gemYellow.png", "bomb.png", "cactus.png", "chain.png", "coinBronze.png", "fireball.png", "gemBlue.png", "keyGreen.png", "mushroomRed.png", "plant.png", "rock.png", "star.png", "weight.png"];

var number_of_stimuli = 4;
var stimuli_present_for_ms = 2000;
var fade_duration = 500;
var n_back = 2;

var back_list = [];
var global_step = 0;
var current_stimuli = -1;
var game_running = false;
var turn_played = false;


function heal(player) {
    console.log("heal");
    $(player).removeClass("stand").addClass("heal");
    setTimeout(function () {
        heal_damage(player, 20);
    }, 600);
}

function attack(attacker) {
    console.log("attack");
    if (Math.random() > 0.5) {
        slash(attacker);
    } else {
        bow(attacker);
    }
}

function slash(player) {
    $(player).removeClass("stand").addClass("slash");
    setTimeout(function () {
        slash_audio.play();
        deal_damage(player, 10);
    }, 100);

}

function bow(player) {
    $(player).removeClass("stand").addClass("bow");
    setTimeout(function () {
        bow_audio.play();
        deal_damage(player, 10);
    }, 600);
}

function hurt(player) {
    $(player).removeClass("stand").addClass("hurt");
    if ($(player).hasClass("skeleton")) {
        giant_hurt_audio.play();
    }
}

function kill(player) {
    $(player).removeClass("stand").addClass("dead");
}

function heal_damage(player, hit_points) {
    var target_player = $(player);
    var target_player_health_bar = target_player.siblings(".health");
    var target_health = parseInt(target_player_health_bar.attr("aria-valuenow"));
    target_health += parseInt(hit_points);
    if (target_health > 100) {
        target_health = 100;
    }
    target_player_health_bar.attr("aria-valuenow", target_health);
    target_player_health_bar.css("width", target_health + "%");
}

function deal_damage(player, damage) {
    var target_player = $($(player).data("target"));
    var target_player_health_bar = target_player.siblings(".health");
    var target_health = target_player_health_bar.attr("aria-valuenow");
    target_health -= damage;
    if (target_health <= 0) {
        target_health = 0;
        kill(target_player);
        stop_game();
    } else {
        hurt(target_player);
    }
    target_player_health_bar.attr("aria-valuenow", target_health);
    target_player_health_bar.css("width", target_health + "%");
}


function put_item_to_backlist(stimuli_id) {
    back_list[global_step % n_back] = stimuli_id;
}

function current_stimuli_is_nback() {
    return back_list[global_step % n_back] == current_stimuli;
}

function present_stimuli() {
    console.log("present_stimuli");
    var stimuli_id = Math.round(Math.random() * (number_of_stimuli - 1));
    $("#stimuli-img").attr("src", stimuli_root + stimuli_list[stimuli_id]).fadeIn(fade_duration);
    turn_played = false;
    return stimuli_id;
}

function stimuli_loop() {
    current_stimuli = present_stimuli();
    console.log(current_stimuli_is_nback());
    setTimeout(function () {
        $("#stimuli-img").fadeOut(fade_duration, function () {
            var was_correct = current_stimuli_is_nback();
            put_item_to_backlist(current_stimuli);
            global_step += 1;
            if (game_running) {
                if (was_correct && !turn_played) {
                    attack(skeleton);
                }
                stimuli_loop()
            } else {
                $(".stimuli").fadeOut(fade_duration);
                $("#stimuli-img").fadeOut(fade_duration);
            }
        });
    }, stimuli_present_for_ms - fade_duration);
}

function reset() {
    back_list = [];
    global_step = 0;
    current_stimuli = -1;
    game_running = false;
    turn_played = false;
    $("#p1").removeClass("bow").removeClass("hurt").removeClass("slash").removeClass("heal").removeClass("dead").addClass("stand");
    $("#p2").removeClass("bow").removeClass("hurt").removeClass("slash").removeClass("heal").removeClass("dead").addClass("stand");
    $(".health").attr("aria-valuenow", 100).css("width", "100%").hide();
    $('.action-bar').hide();
    $('.portrait').hide();
}

function attack_action() {
    var attacker;
    if (current_stimuli_is_nback()) {
        attacker = player;
    } else {
        attacker = skeleton;
    }
    attack(attacker);
}

function heal_action() {
    if (current_stimuli_is_nback()) {
        heal(player);
    } else {
        attack(skeleton)
    }
}

function start_game() {
    console.log("start game");
    $(".portrait").fadeIn(fade_duration, function () {
        $(".health").fadeIn(fade_duration);
    });
    $(".action-bar").fadeIn(fade_duration*3, function () {
            game_running = true;
            stimuli_loop();
            $(".stimuli").fadeIn(fade_duration);
            // $("#stimuli-img").fadeIn(fade_duration);
        });
}

function stop_game() {
    game_running = false;
}

$(document).ready(function () {

    $(".play-button-container").on("click", function () {
        $("#home-page").fadeOut(1000, function () {
            $("#game-page").fadeIn(1000, function () {
                $(".animation").addClass("walk").show();
            });
        });
    });

    $(".animation").on("webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function () {
            var thiz = $(this);
            thiz.fadeOut(1500, function () {
                console.log("running start_game");
                start_game();
                thiz.hide();
            });

        }
    );
    $(".portrait").on("webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function () {
            var thiz = $(this);
            if (!thiz.hasClass("dead")) {
                thiz.removeClass("bow").removeClass("hurt").removeClass("slash").removeClass("heal").addClass("stand");
            } else if (thiz.hasClass("dead")) {
                $("#game-page").fadeOut(1000, function () {
                    $("#home-page").fadeIn(1000, function () {
                        reset();
                    });
                });
            }
        }
    );
    preload();
    background_music.loop = true;
    background_music.play();

    $(document).keypress(function (event) {
        if (event.which == 49 || event.which == 50) {
            event.preventDefault();
            if (game_running && !turn_played) {
                turn_played = true;
                if (event.which == 49) {
                    attack_action();
                } else {
                    heal_action();
                }
            }
        }
    });
});


function preload() {
    $(stimuli_list).each(function () {
        $('<img />').attr('src', stimuli_root + this).appendTo('body').css('display', 'none');
    });
}

