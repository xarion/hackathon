var slash_audio = new Audio('audio/battle/sword-unsheathe.wav');
var bow_audio = new Audio('audio/battle/swing3.wav');
var giant_hurt_audio = new Audio('audio/NPC/giant/giant3.wav');

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

function deal_damage(player, damage) {
    var targetPlayer = $($(player).data("target"));
    var targetHealthBar = targetPlayer.siblings(".health");
    var targetHealth = targetHealthBar.attr("aria-valuenow");
    targetHealth -= damage;
    if (targetHealth < 0) {
        targetHealth = 0;
    }
    targetHealthBar.attr("aria-valuenow", targetHealth);
    targetHealthBar.css("width", targetHealth + "%");
    hurt(targetPlayer);
}

$(document).ready(function () {
    $(".portrait").on("webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function () {
            var thiz = $(this);
            thiz.removeClass("bow").removeClass("hurt").removeClass("slash").addClass("stand");
            // rest is for fun purposes
            // setTimeout(function () {
            //     slash(thiz);
            // }, 1000);
        }
    );
});
