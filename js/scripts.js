var background_music = new Audio('audio/background.mp3')
var slash_audio = new Audio('audio/battle/sword-unsheathe.wav');
var bow_audio = new Audio('audio/battle/swing3.wav');
var giant_hurt_audio = new Audio('audio/NPC/giant/giant3.wav');
var player = "#p1";
var skeleton = "#p2";


function heal(player) {
    $(player).removeClass("stand").addClass("heal");
    setTimeout(function () {
        heal_damage(player, 20);
    }, 600);
}

function attack(attacker) {
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


function heal_damage(player, hit_points) {
    console.log(hit_points);
    var target_player = $(player);
    var target_player_health_bar = target_player.siblings(".health");
    var target_health = parseInt(target_player_health_bar.attr("aria-valuenow"));
    console.log(target_health);
    target_health += parseInt(hit_points);
    console.log(target_health);
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
        stop_game(player);
    }
    target_player_health_bar.attr("aria-valuenow", target_health);
    target_player_health_bar.css("width", target_health + "%");
    hurt(target_player);
}

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

function put_item_to_backlist(stimuli_id) {
    back_list[global_step % n_back] = stimuli_id;
}

function current_stimuli_is_nback() {
    return back_list[global_step % n_back] == current_stimuli;
}

function present_stimuli() {
    var stimuli_id = Math.round(Math.random() * (number_of_stimuli - 1));
    console.log(stimuli_id);
    console.log(stimuli_list[stimuli_id]);
    $("#stimuli-img").attr("src", stimuli_root + stimuli_list[stimuli_id]);
    $("#stimuli-img").fadeIn(fade_duration);
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
    game_running = true;
    stimuli_loop();
    $(".stimuli").fadeIn(fade_duration);
    $("#stimuli-img").fadeIn(fade_duration);
}

function stop_game(winner) {
    game_running = false;
    if (winner == player) {
        alert("Congratulations, you won!");
    } else {
        alert("Practice makes perfect, keep playing.")
    }
    heal_damage(skeleton, 100);
    heal_damage(player, 100);
}

function preload() {
    $(stimuli_list).each(function () {
        $('<img />').attr('src', stimuli_root + this).appendTo('body').css('display', 'none');
    });
}
// Usage:


$(document).ready(function () {

    $(".portrait").on("webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function () {
            var thiz = $(this);
            thiz.removeClass("bow").removeClass("hurt").removeClass("slash").removeClass("heal").addClass("stand");
            // rest is for fun purposes
            // setTimeout(function () {
            //     slash(thiz);
            // }, 1000);
        }
    );
    preload();
    // present_stimuli();
    // background_music.loop = true;
    // background_music.play()

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

