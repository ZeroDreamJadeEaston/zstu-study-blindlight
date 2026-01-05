type = "mysql+pymysql"
username = "root"
password = "20051008"
ipaddrsss = "127.0.0.1"
port = 3306
schema = "seproject"

SQLALCHEMY_DATABASE_URL = f"{type}://{username}:{password}@{ipaddrsss}:{port}/{schema}"
imgprefix = "http://127.0.0.1:8000/source/"
testopenid = "oxxHL5GS26iMW6iSMzfoLjXk1luw"
imgpath = "../wxfile/source/seproject/"

wxurl = "https://api.weixin.qq.com/sns/jscode2session"
wxappid = "wxefe226f4fe64e02a"
wxsecret = "2143eaf0059c1bbb1c7194221bc8f3ee"

# 在终端中通过uvicorn启动
# uvicorn seproject_app.main:app --reload