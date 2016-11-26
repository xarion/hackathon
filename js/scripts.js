var slash_audio = new Audio('audio/battle/sword-unsheathe.wav');

function slash(player) {
    $(player).removeClass("stand").addClass("slash");
    setTimeout(function () {
        slash_audio.play();
    }, 100);
    deal_damage(player, 10);
}

function bow(player) {
    $(player).removeClass("stand").addClass("bow");
}

function hurt(player) {
    $(player).removeClass("stand").addClass("hurt");
}

function deal_damage(player, damage) {
    var targetHealthBar = $($(player).data("target")).siblings(".health");
    var targetHealth = targetHealthBar.attr("aria-valuenow");
    targetHealth -= damage;
    if (targetHealth < 0) {
        targetHealth = 0;
    }
    targetHealthBar.attr("aria-valuenow", targetHealth);
    targetHealthBar.css("width", targetHealth + "%");
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
