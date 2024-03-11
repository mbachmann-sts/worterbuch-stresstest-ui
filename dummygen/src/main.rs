use random_word::Lang;
use worterbuch_client::{connect_with_default_config, topic, Ack, ServerMessage};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let words = 50_000;

    let (wb, _) = connect_with_default_config(async {}).await?;

    for i in 0..words {
        wb.set(
            topic!("worterbuch-virtualized", i),
            &random_word::gen(Lang::En),
        )
        .await?;
    }

    let mut rx = wb.all_messages().await?;

    while let Some(msg) = rx.recv().await {
        if let ServerMessage::Ack(Ack { transaction_id }) = msg {
            if transaction_id % 1000 == 0 {
                eprintln!("{transaction_id}")
            }
            if transaction_id == words {
                break;
            }
        }
    }

    wb.close().await?;

    Ok(())
}
