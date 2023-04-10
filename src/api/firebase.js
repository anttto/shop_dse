import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, update } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { v4 as uuid } from "uuid";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

//로그인
export async function login() {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      return user;
    })
    .catch((error) => {
      console.log(error);
    });
}

//로그아웃
export async function logout() {
  return signOut(auth).then(() => null);
}

//유저 상태 체크
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    //새로운 규칙 추가 가능
    // const updatedUser = user ? await adminUser(user) : null;
    callback(user);
  });
}

//좋아요 한 제품 목록
export async function getLiked(userId) {
  return get(ref(database, `liked/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      const likedProducts = Object.values(snapshot.val());
      return likedProducts;
    }
    return [];
  });
}

export async function removeLikedProduct(userId, product) {
  return remove(ref(database, `liked/${userId}/${product.productId}`));
}

//좋아요 추가 : DB Create
export async function addLikedProduct(userId, product) {
  return set(ref(database, `liked/${userId}/${product.productId}`), {
    productId: product.productId,
  });
}

//좋아요 카운트 제어
export async function updateLikeCount(likeCnt, product) {
  return set(ref(database, `products/${product.productId}`), {
    ...product,
    productId: product.productId,
    uid: product.uid,
    title: product.title,
    url: product.url,
    description: product.description,
    liked: likeCnt,
  });
}

//내그림 읽어오기
export async function getMyArtwork(userId) {
  return get(ref(database, `products`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const arr = Object.values(snapshot.val());
        const myArtworks = arr.filter((product) => product.uid === userId);
        return myArtworks.reverse();
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
    });
}

// const findDuplicates = (obj1, obj2) => {
//   const duplicates = {};
//   obj1).forEach((key) =>{
//     if (obj2.hasOwnProperty(key) && obj1[key] === obj2[key]) {
//       console.log(key);
//       duplicates[key] = obj1[key];
//     }
//   });
//   return duplicates;
// };

export async function getMyLikedArtwork(likedProduct) {
  return get(ref(database, `products`)).then((snapshot) => {
    const like = likedProduct;
    console.log(like);

    if (snapshot.exists()) {
      if (likedProduct) {
      }
      if (snapshot) {
        const like = likedProduct;
        console.log(like);
      }
    }
  });
}

//전체 그림 목록 읽기
export async function getAllArtwork() {
  return get(ref(database, `products`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const arr = Object.values(snapshot.val());
        return shuffle(arr);
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
    });
}
//전체 그림 목록 - 랜덤 배열 셔플
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function selectArtwork(productId) {
  return get(ref(database, `products`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const arr = Object.values(snapshot.val());
        const selectArtwork = arr.filter((product) => product.productId === productId);
        return selectArtwork[0];
        // console.log(selectArtwork[0]);
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
    });
}

//그림 업로드
export async function addNewArtwork(uid, product, imageUrl) {
  const productId = uuid();
  return set(ref(database, `products/${productId}`), {
    ...product,
    productId: productId,
    uid: uid,
    title: product.title,
    url: imageUrl,
    description: product.description,
    liked: 0,
    // type: product.type,
  }).catch((error) => {
    console.error(error);
  });
}

//---------------------구현 필요한 것들---------------------
//그림 수정
//
//그림 삭제
//
//좋아요 해제하기
// export async function removeLikedProduct(userId, product) {
//   return remove(ref(database, `carts/${userId}/${product.id}`));
// }
//---------------------구현 필요한 것들---------------------
//어드민 체크 로직
// async function adminUser(user) {
//   return get(ref(database, `admins`))
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         const admins = snapshot.val();
//         const isAdmin = admins.includes(user.uid);
//         return { ...user, isAdmin: isAdmin };
//       } else {
//         return user;
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }
