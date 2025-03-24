FROM maven:3.8.5-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY . .
RUN cd backend/order-service && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
COPY --from=build /app/backend/order-service/target/*.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]