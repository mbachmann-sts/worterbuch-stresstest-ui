use random_word::Lang;
use worterbuch_client::{connect_with_default_config, Ack, ServerMessage};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let words = 1_000;

    let (wb, _) = connect_with_default_config(async {}).await?;

    let mut generated_words = vec![];

    for _ in 0..words {
        generated_words.push(random_word::gen(Lang::En));
    }

    eprintln!("Done generating words, puhing to worterbuch ...");

    let mut rx = wb.all_messages().await?;

    for (i, word) in generated_words.iter().enumerate() {
        let tid = wb.set(format!("worterbuch-virtualized/{i}"), &word).await?;
        if tid % 1000 == 0 {
            while let Some(msg) = rx.recv().await {
                if let ServerMessage::Ack(Ack { transaction_id }) = msg {
                    if transaction_id == tid {
                        eprintln!("{transaction_id}");
                        break;
                    }
                }
            }
        }
    }

    wb.close().await?;

    Ok(())
}
