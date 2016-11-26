$(document).ready(function () {
    $(".portrait").on("webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function () {
            var thiz = $(this);
            thiz.removeClass("bow").removeClass("hurt").removeClass("slash").addClass("stand");
            // rest is for fun purposes
            setTimeout(function () {
                slash(thiz);
            }, 1000);
        }
    );
});
function slash(player) {
    $(player).removeClass("stand").addClass("slash");
}
function bow(player) {
    $(player).removeClass("stand").addClass("bow");
}
function hurt(player) {
    $(player).removeClass("stand").addClass("hurt");
}