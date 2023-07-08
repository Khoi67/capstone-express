import { decodeToken, generateToken } from "../config/jwt.js";
import sequelize from "../models/index.js";
import initModels from "../models/init-models.js";
import bcrypt from "bcrypt";

const models = initModels(sequelize);

// const getUser = async (req, res) => {
//   let data = await models.nguoi_dung.findAll();

//   res.send(data);
// };

//Dang ky

const userRegister = async (req, res) => {
  let { email, mat_khau, ho_ten, tuoi, anh_dai_dien } = req.body;

  let newUser = {
    email,
    mat_khau: bcrypt.hashSync(mat_khau, 10),
    ho_ten,
    tuoi,
    anh_dai_dien,
  };

  let checkEmail = await models.nguoi_dung.findAll({
    where: {
      email: email,
    },
  });

  if (checkEmail.length > 0) {
    res.send("Email đã tồn tại!");
  } else {
    await models.nguoi_dung.create(newUser);
    res.send("Đăng ký thành công!");
  }
};

//Dang nhap

const userLogin = async (req, res) => {
  let { email, mat_khau } = req.body;

  let checkUser = await models.nguoi_dung.findOne({
    where: {
      email,
    },
  });

  if (checkUser) {
    if (bcrypt.compareSync(mat_khau, checkUser.mat_khau)) {
      checkUser = { ...checkUser.dataValues, mat_khau: "" };

      let token = generateToken(checkUser);
      res.send(token);
    } else {
      res.send("Mật khẩu sai!");
    }
  } else {
    res.send("Email sai hoặc không tồn tại!");
  }
};

//Lay thong tin ca nhan
const getInfoUser = async (req, res) => {
  let { token } = req.headers;
  let infoUser = decodeToken(token);

  let getUser = await models.nguoi_dung.findOne({
    where: {
      nguoi_dung_id: infoUser.data.nguoi_dung_id,
    },
  });
  res.send(getUser);
};

//Them anh
const addPicture = async (req, res) => {
  let { ten_hinh, duong_dan, mo_ta, nguoi_dung_id } = req.body;
  let newPic = {
    ten_hinh,
    duong_dan,
    mo_ta,
    nguoi_dung_id,
  };
  let checkIdUser = await models.nguoi_dung.findAll({
    where: {
      nguoi_dung_id,
    },
  });
  if (checkIdUser.length > 0) {
    await models.hinh_anh.create(newPic);
    res.send("Thêm hình thành công!");
  } else {
    res.send("Chưa có tài khoản để thêm hình!");
  }
};
//Lay hinh
const getPicture = async (req, res) => {
  let picture = await models.hinh_anh.findAll();

  res.send(picture);
};
//Lay hinh theo ten
const getPicByName = async (req, res) => {
  let { name } = req.params;
  let user = await models.nguoi_dung.findOne({
    attributes: ["nguoi_dung_id"],
    where: {
      ho_ten: name,
    },
  });
  if (!user) {
    res.send("Không tồn tại người dùng!");
  } else {
    let picture = await models.hinh_anh.findAll({
      where: {
        nguoi_dung_id: user.nguoi_dung_id,
      },
    });
    res.send(picture);
  }
};
//Hien thi binh luan
const getComment = async (req, res) => {
  let data = await models.binh_luan.findAll();
  res.send(data);
};
//Binh luan
const addComment = async (req, res) => {
  let { nguoi_dung_id, hinh_id, noi_dung } = req.body;

  let newComment = {
    nguoi_dung_id,
    hinh_id,
    ngay_binh_luan: new Date(),
    noi_dung,
  };
  let checkIdUser = await models.nguoi_dung.findAll({
    where: {
      nguoi_dung_id,
    },
  });
  let checkIdHinh = await models.hinh_anh.findAll({
    where: {
      hinh_id,
    },
  });
  if (checkIdUser.length > 0) {
    if (checkIdHinh.length > 0) {
      await models.binh_luan.create(newComment);
      res.send("Thêm bình luận thành công!");
    } else {
      res.send("Hình không tồn tại!");
    }
  } else {
    res.send("Người dùng không tồn tại!");
  }
};
//Lay hinh theo id hinh
const getPicById = async (req, res) => {
  let { id } = req.params;
  let getPicture = await models.hinh_anh.findAll({
    where: {
      hinh_id: id,
    },
  });
  if (getPicture.length > 0) {
    res.send(getPicture);
  } else {
    res.send("Hình không tồn tại!");
  }
};
//Save anh
const savePicture = async (req, res) => {
  let { nguoi_dung_id, hinh_id } = req.body;
  let savePic = {
    nguoi_dung_id,
    hinh_id,
    ngay_luu: new Date(),
  };
  let checkIdUser = await models.nguoi_dung.findAll({
    where: {
      nguoi_dung_id,
    },
  });
  let checkIdHinh = await models.hinh_anh.findAll({
    where: {
      hinh_id,
    },
  });
  if (checkIdUser.length > 0) {
    if (checkIdHinh.length > 0) {
      await models.luu_anh.create(savePic);
      res.send("Lưu hình thành công!");
    } else {
      res.send("Hình không tồn tại!");
    }
  } else {
    res.send("Người dùng không tồn tại!");
  }
};
//Lay thong tin luu anh theo id user
const getSavedPic = async (req, res) => {
  let { id } = req.params;
  let getSaved = await models.luu_anh.findAll({
    where: {
      nguoi_dung_id: id,
    },
  });
  let checkUser = await models.nguoi_dung.findAll({
    where: {
      nguoi_dung_id: id,
    },
  });
  if (checkUser.length > 0) {
    if (getSaved.length > 0) {
      res.send(getSaved);
    } else {
      res.send("Chưa lưu ảnh!");
    }
  } else {
    res.send("Không tồn tại người dùng!");
  }
};

//Xoa hinh da tao theo id hinh
const deletePic = async (req, res) => {
  let { id } = req.params;

  //Xoa cac bang lien quan
  await models.binh_luan.destroy({ where: { hinh_id: id } });
  await models.luu_anh.destroy({ where: { hinh_id: id } });

  await models.hinh_anh.destroy({ where: { hinh_id: id } });

  res.send("Xóa ảnh thành công!");
};

export {
  getInfoUser,
  userRegister,
  userLogin,
  addPicture,
  getPicture,
  getPicByName,
  addComment,
  getPicById,
  getSavedPic,
  savePicture,
  getComment,
  deletePic,
};
