$(document).ready(function() {
    const initialForm = $('.size').first().clone(true);

    function setUpImagePreview(container) {
        container.find('.image').on('change', function(event) {
            const input = event.target;
            const preview = container.find('.preview');
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.html('<img src="' + e.target.result + '" alt="Image Preview" style="max-width: 100%; max-height: 200px;">');
                    preview.show();
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                preview.html('').hide();
            }
        });
    }

    function setUpSaveButton(container) {
        container.find('.save').on('click', function() {
            const id = container.data('id');
            console.log('Saving data for ID:', id); // デバッグ用

            const date = container.find('.date').val();
            const weather = container.find('.weather').val();
            const temperature = container.find('.temperature').val();
            const mood = container.find('.mind').val();
            const diary = container.find('.textarea').val();
            const imageFile = container.find('.image')[0].files[0];

            console.log("Saving data for ID:", id);
            console.log("Date:", date);
            console.log("Weather:", weather);
            console.log("Temperature:", temperature);
            console.log("Mood:", mood);
            console.log("Diary:", diary);
            console.log("Image:", imageFile);

            localStorage.setItem(`date${id}`, date);
            localStorage.setItem(`weather${id}`, weather);
            localStorage.setItem(`temperature${id}`, temperature);
            localStorage.setItem(`mood${id}`, mood);
            localStorage.setItem(`diary${id}`, diary);

            alert('保存しました！');
        });
    }

    function setUpClearButton(container) {
        container.find('.clear').on('click', function() {
            const id = container.data('id');
            localStorage.removeItem(`date${id}`);
            localStorage.removeItem(`weather${id}`);
            localStorage.removeItem(`temperature${id}`);
            localStorage.removeItem(`mood${id}`);
            localStorage.removeItem(`diary${id}`);
            localStorage.removeItem(`image${id}`);

            container.find('.date').val('');
            container.find('.weather').val('');
            container.find('.temperature').val('');
            container.find('.mind').val('');
            container.find('.textarea').val('');
            container.find('.preview').html('').hide();
            container.find('.image').val('');

            alert('データをクリアしました！');
        });
    }

    function setUpDeleteButton(container) {
        container.find('.delete').on('click', function() {
            const id = container.data('id');
            localStorage.removeItem(`date${id}`);
            localStorage.removeItem(`weather${id}`);
            localStorage.removeItem(`temperature${id}`);
            localStorage.removeItem(`mood${id}`);
            localStorage.removeItem(`diary${id}`);
            localStorage.removeItem(`image${id}`);

            container.remove(); // フォームを削除
        });
    }

    function loadFormData() {
        const ids = JSON.parse(localStorage.getItem('formIds')) || [];
        $(".size").remove(); // 既存のフォームを削除
    
        ids.forEach(id => {
            console.log('Restoring data for ID:', id);
            const clone = initialForm.clone(true);
            clone.data('id', id);
            $("#form-clone").prepend(clone);
            // LocalStorageからデータを復元
            clone.find('.date').val(localStorage.getItem(`date${id}`) || '');
            clone.find('.weather').val(localStorage.getItem(`weather${id}`) || '');
            clone.find('.temperature').val(localStorage.getItem(`temperature${id}`) || '');
            clone.find('.mind').val(localStorage.getItem(`mood${id}`) || '');
            clone.find('.textarea').val(localStorage.getItem(`diary${id}`) || '');

            setUpSaveButton(clone);
            setUpClearButton(clone);
            setUpDeleteButton(clone);
            setUpImagePreview(clone); // ここで画像プレビューのセットアップを追加
        });
    }

    $(window).on('load', function() {
        loadFormData();  // ロード時にデータを復元
    });

    $("#tsuika").on("click", function() {
        const ids = JSON.parse(localStorage.getItem('formIds')) || [];
        const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

        console.log('Adding new form with ID:', newId); // デバッグ用

        const clone = initialForm.clone(true);
        clone.data('id', newId);
        clone.find("input, select, textarea").val("");
        clone.find(".preview").empty();
        $("#form-clone").prepend(clone);

        ids.push(newId);
        localStorage.setItem('formIds', JSON.stringify(ids));
    
        setUpSaveButton(clone);
        setUpClearButton(clone);
        setUpDeleteButton(clone);
        setUpImagePreview(clone); // ここで画像プレビューのセットアップを追加
    });

    $('#matome').on('click', function() {
        var data = [];

        // 日付、気温、気分データを収集してオブジェクトの配列にする
        $('.size').each(function() {
            var date = $(this).find('.date').val();
            var temp = $(this).find('.temperature').val();
            var mood = $(this).find('.mind').val(); // 気分データ
            if (date && temp && mood) {
                data.push({ date: date, temperature: parseInt(temp), mood: parseInt(mood) });
            }
        });

        // 日付を基準にデータを昇順にソート
        data.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        // ソートされたデータから日付、気温、気分の配列を作成
        var dates = data.map(function(item) { return item.date; });
        var temperatures = data.map(function(item) { return item.temperature; });
        var moods = data.map(function(item) { return item.mood; });

        // データをURLパラメータとして新しいタブで開く
        var url = 'graph.html?dates=' + dates.join(',') + '&temperatures=' + temperatures.join(',') + '&moods=' + moods.join(',');
        window.open(url, '_blank');
    });
});