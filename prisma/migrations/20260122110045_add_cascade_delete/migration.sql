-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_houseId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_categorieId_fkey";

-- DropForeignKey
ALTER TABLE "MoviesHousesAccess" DROP CONSTRAINT "MoviesHousesAccess_houseId_fkey";

-- DropForeignKey
ALTER TABLE "MoviesPerson" DROP CONSTRAINT "MoviesPerson_movieId_fkey";

-- DropForeignKey
ALTER TABLE "UserFilmHistory" DROP CONSTRAINT "UserFilmHistory_movieId_fkey";

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesHousesAccess" ADD CONSTRAINT "MoviesHousesAccess_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFilmHistory" ADD CONSTRAINT "UserFilmHistory_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesPerson" ADD CONSTRAINT "MoviesPerson_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
