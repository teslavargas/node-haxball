module.exports = function(API){
	const {Language, Errors: {ErrorCodes}} = API;
	Object.setPrototypeOf(this, Language.prototype);
	Language.call(this, "TR", {
		name: "Türkçe",
		version: "0.1",
		author: "abc",
		description: "Default Turkish translation"
	});
	this.api = {
		errors: {
			[ErrorCodes.Empty]: "",
			[ErrorCodes.ConnectionClosed]: 'Bağlantı kapatıldı$1?(" $1":"")',
			[ErrorCodes.GameStateTimeout]: "Oyun durumu süre aşımı",
			[ErrorCodes.RoomClosed]: "Oda kapatıldı."  ,
			[ErrorCodes.RoomFull]: "Oda dolu.",
			[ErrorCodes.WrongPassword]: "Şifre yanlış.",
			[ErrorCodes.BannedBefore]: "Bu odadan yasaklanmışsınız.",
			[ErrorCodes.IncompatibleVersion]: "Uyumsuz oyun sürümü.",
			[ErrorCodes.FailedHost]: "Oda sunucusuna bağlanılamadı. Problem devam ederse şu rehbere bakınız: https://github.com/haxball/haxball-issues/wiki/Connection-Issues",
			[ErrorCodes.Unknown]: "Odaya girerken bir problem oluştu.<br><br>Bunun nedeni bir tarayıcı eklentisi olabilir, bütün eklentileri devre dışı bırakıp siteyi yenilemeyi deneyiniz.<br><br>Oluşan hata mesajı konsola yazdırıldı.",
			[ErrorCodes.Cancelled]: "İptal edildi",
			[ErrorCodes.FailedPeer]: "Eşe bağlanılamadı.",
			[ErrorCodes.KickedNow]: '$3?("$3 tarafından o":"O")dadan $2?("yasaklandınız":"atıldınız")$1?(" ($1)":"")',
			[ErrorCodes.Failed]: "Başarısız",
			[ErrorCodes.MasterConnectionError]: "Ana sunucu bağlantı hatası",
			[ErrorCodes.StadiumParseError]: '"$1" bölümü, $2 konumunda hata.',
			[ErrorCodes.StadiumParseSyntaxError]: "$1 satırında sözdizimi hatası",
			[ErrorCodes.StadiumParseUnknownError]: "Stadyum dosyası açılırken hata.",
			[ErrorCodes.ObjectCastError]: "$1 nesnesi $2 tipine dönüştürülemiyor",
			[ErrorCodes.TeamColorsReadError]: "Çok fazla",
			[ErrorCodes.UTF8CharacterDecodeError]: "$1 konumundaki UTF8 karakteri çözümlenemedi: karakter kodu ($2) geçersiz",
			[ErrorCodes.ReadTooMuchError]: "Çok fazla okundu",
			[ErrorCodes.ReadWrongStringLengthError]: "Gerçek yazı uzunluğu belirtilenden farklı: $1 byte",
			[ErrorCodes.EncodeUTF8CharNegativeError]: "UTF8 karakteri çözülemedi: karakter kodu ($1) negatif",
			[ErrorCodes.EncodeUTF8CharTooLargeError]: "UTF8 karakteri çözülemedi: karakter kodu ($1) çok büyük (>= 0x80000000)",
			[ErrorCodes.CalculateLengthOfUTF8CharNegativeError]: "UTF8 karakterinin uzunluğu hesaplanamadı: karakter kodu ($1) negatif",
			[ErrorCodes.CalculateLengthOfUTF8CharTooLargeError]: "UTF8 karakterinin uzunluğu hesaplanamadı: karakter kodu ($1) çok büyük (>= 0x80000000)",
			[ErrorCodes.BufferResizeParameterTooSmallError]: "Buffer 1 byte kapasitesinden küçük bir değere yeniden boyutlandırılamadı",
			[ErrorCodes.BadColorError]: "Kötü renk",
			[ErrorCodes.BadTeamError]: "Kötü takım değeri",
			[ErrorCodes.StadiumLimitsExceededError]: "Hata",
			[ErrorCodes.MissingActionConfigError]: "Sınıfın ayarı yok",
			[ErrorCodes.UnregisteredActionError]: "Kayıtsız bir hareket paketlenmeye çalışıldı.",
			[ErrorCodes.MissingImplementationError]: "Fonksiyon kodları eksik",
			[ErrorCodes.AnnouncementActionMessageTooLongError]: "Mesaj çok uzun",
			[ErrorCodes.ChatActionMessageTooLongError]: "Mesaj çok uzun",
			[ErrorCodes.KickBanReasonTooLongError]: "Yazı çok uzun",
			[ErrorCodes.ChangeTeamColorsInvalidTeamIdError]: "Geçersiz takım idsi",
			[ErrorCodes.MissingRecaptchaCallbackError]: "Recaptcha talep edildi. Oda oluştururken/odaya girerken çalışan bir recaptcha token ayarlayın.",
			[ErrorCodes.ReplayFileVersionMismatchError]: "Tekrarlama verisinin sürümü farklı",
			[ErrorCodes.ReplayFileReadError]: "Tekrarlama verisi yüklenemedi.",
			[ErrorCodes.JoinRoomNullIdAuthError]: "id ve authObj null olamaz. (1. parametrede)",
			[ErrorCodes.PlayerNameTooLongError]: "İsim çok uzun",
			[ErrorCodes.PlayerCountryTooLongError]: "Bayrak çok uzun",
			[ErrorCodes.PlayerAvatarTooLongError]: "Avatar çok uzun",
			[ErrorCodes.PlayerJoinBlockedByMPDError]: "Oyuncu girişine izin verilmedi: $3 $4 $5 $1 $2",
			[ErrorCodes.PlayerJoinBlockedByORError]: "Oyuncu giriş olayı OperationReceived tarafından engellendi: $1",
			[ErrorCodes.PluginNotFoundError]: "$1 konumunda eklenti bulunamadı",
			[ErrorCodes.PluginNameChangeNotAllowedError]: "Eklenti adı değişmemeli",
			[ErrorCodes.LibraryNotFoundError]: "$1 konumunda kütüphane bulunamadı",
			[ErrorCodes.LibraryNameChangeNotAllowedError]: "Kütüphane adı değişmemeli",
			[ErrorCodes.AuthFromKeyInvalidIdFormatError]: "Id formatı geçersiz",
			[ErrorCodes.BadActorError]: "Kötü Aktör",
			[ErrorCodes.AuthBannedError]: "Auth yasaklandı: $1",
			[ErrorCodes.NoProxyIdentityProblem]: "Basro'nun backendi üyelik sistemi ile uyumlu değil, bu nedenle kimlik tokeni ve kimlik olayları devre dışı bırakıldı.",
			[ErrorCodes.NoProxyIdentitySolution]: "Çözüm: Bir vekil sunucu kullanın ve üyelik verilerini orada işleyin.",
			[ErrorCodes.FailedToCreateRoom]: "Oda oluşturulmaya çalışılırken bir hata oluştu. (1$)"
		}
	};
};
