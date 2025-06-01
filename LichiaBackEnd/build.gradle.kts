// Este arquivo cuida dos detalhes da build e foi gerado automaticamente pelo Gradle (mas com edições manuais
// para os nosso propósitos).

// Arquivos .kts são do tipo Kotlin Script. Usa sintaxe semelhante ao Kotlin, mas é executado como script ao
// invés de sem compilar como um .kt.

plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlin.plugin.serialization)
}

group = "com.example"
version = "0.0.1"

application {
    mainClass = "io.ktor.server.netty.EngineMain"

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("org.postgresql:postgresql:42.6.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.9.2")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    testImplementation("io.ktor:ktor-server-test-host-jvm:3.1.3")
    testImplementation("io.ktor:ktor-server-test-host:3.1.3")
    testImplementation("io.ktor:ktor-client-content-negotiation:3.1.3")
    testImplementation("io.ktor:ktor-client-cio:3.1.3")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:2.1.10")

    implementation(libs.ktor.server.status.pages)
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.exposed.core)
    implementation(libs.exposed.jdbc)
    implementation(libs.exposed.dao)
    implementation(libs.ktor.server.host.common)
    implementation(libs.ktor.server.netty)
    implementation(libs.logback.classic)
    implementation(libs.ktor.server.config.yaml)
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(21)
}
